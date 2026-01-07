// Ejecuta: node scripts/scrape-lfb.js
import { writeFile } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";
import * as cheerio from "cheerio";
import { fetch } from "undici";


async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118 Safari/537.36",
      "accept": "text/html,application/xhtml+xml",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} en ${url}`);
  return await res.text();
}

function normalizeText(t) {
  return (t || "").replace(/\s+/g, " ").trim();
}


function parseNewsCards($, baseUrl) {
  const items = [];

  $("a[href*='/lfb/noticia/'], article a[href*='/lfb/noticia/']").each((_, a) => {
    const $a = $(a);
    const href = new URL($a.attr("href"), baseUrl).toString();
    const card = $a.closest("article, .card, .noticia, .news, li").first();
    const title =
      normalizeText($a.attr("title")) ||
      normalizeText(card.find("h2, h3, .title, .card-title").first().text()) ||
      normalizeText($a.text());

    const date =
      normalizeText(
        card.find("time, .date, .fecha, .post-date, .news-date").first().text()
      ) || null;

 
    const img =
      card.find("img").attr("data-src") ||
      card.find("img").attr("src") ||
      null;

    if (href && title) items.push({ title, href, date, img });
  });

  const dedup = [];
  const seen = new Set();
  for (const it of items) {
    const key = it.href;
    if (!seen.has(key)) {
      seen.add(key);
      dedup.push(it);
    }
  }
  return dedup;
}

async function fetchArticleDetails(url) {
  const html = await fetchHtml(url);
  const $ = cheerio.load(html);

  const title =
    normalizeText($("h1, .title, .post-title").first().text()) || null;

  const date =
    normalizeText(
      $("time, .date, .fecha, .post-date").first().text()
    ) || null;

  const img =
    $("article img").first().attr("data-src") ||
    $("article img").first().attr("src") ||
    $("meta[property='og:image']").attr("content") ||
    null;

  const excerpt =
    normalizeText(
      $("article p, .post-content p, .entry-content p").first().text()
    ) || null;

  return { title, date, img, excerpt };
}

async function main() {
  const baseTeam = "https://www.laliganacional.com.ar/lfb/equipo/2015/90076/san-jose-mendoza/inicio";
  const baseNews = "https://www.laliganacional.com.ar/lfb/noticias";

  let list = [];
  try {
    const htmlTeam = await fetchHtml(baseTeam);
    const $team = cheerio.load(htmlTeam);
    list = list.concat(parseNewsCards($team, baseTeam));
    await delay(400);
  } catch (e) {
    console.warn("No pude leer portada de equipo:", e.message);
  }

  try {
    const htmlNews = await fetchHtml(baseNews);
    const $news = cheerio.load(htmlNews);
    const all = parseNewsCards($news, baseNews);

    const filtered = all.filter(it =>
      /san\s*jose|mendoza/i.test(`${it.title} ${it.href}`)
    );
    list = list.concat(filtered);
  } catch (e) {
    console.warn("No pude leer listado global:", e.message);
  }

  const unique = [];
  const seen = new Set();
  for (const it of list) {
    if (seen.has(it.href)) continue;
    seen.add(it.href);

    if (!/laliganacional\.com\.ar\/lfb\/noticia\//i.test(it.href)) continue;

    try {
      const det = await fetchArticleDetails(it.href);
      unique.push({
        ...it,
        title: det.title || it.title,
        date: det.date || it.date,
        img: det.img || it.img,
        excerpt: det.excerpt || null,
      });
      await delay(350);
    } catch (e) {
      console.warn("Detalle falló:", it.href, e.message);
    }
  }

  const data = {
    fetchedAt: new Date().toISOString(),
    count: unique.length,
    items: unique.slice(0, 30), 
  };

  await writeFile("./public/news.json", JSON.stringify(data, null, 2), "utf8");
  console.log(`Generado public/news.json con ${data.count} noticias`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
