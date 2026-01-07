"use client";

export default function InteractiveCourt({ onHover, activePart = null }) {
  const handleMouseMove = (e) => {
    const info = e.currentTarget.getAttribute("data-info");
    onHover?.({ visible: true, content: info, x: e.pageX, y: e.pageY });
  };
  const handleMouseLeave = () =>
    onHover?.({ visible: false, content: "", x: 0, y: 0 });

  const isActive = (part) => {
    if (activePart === "halfCourt")
      return ["center", "leftKey", "rightKey"].includes(part);
    return activePart && part === activePart;
  };

  const transitionCls =
    "transition-[fill,filter,transform] duration-300 motion-reduce:transition-none";

  // 🎨 Tokens
  const COURT_FILL = "#EAF6FC"; 
  const LINES_STROKE = "var(--negro)";
  const AREA_ACTIVE = "var(--azul-sanjo)";     
  const AREA_INACTIVE = "var(--celeste-sanjo)"; 

  const mkAreaProps = (part) => {
    const active = isActive(part);
    return {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
      className: `cursor-pointer ${transitionCls}`,
      style: {
        fill: active ? AREA_ACTIVE : AREA_INACTIVE,
        filter: active ? "drop-shadow(0 0 14px rgba(21,28,71,0.4))" : "none",
      },
    };
  };

  // --- Dimensiones ---
  const courtWidth = 940;
  const courtHeight = 500;
  const keyWidth = 160;
  const keyLength = 190;
  const keyY = (courtHeight - keyWidth) / 2;
  const ftCircleRadius = 60;
  const ftCircleCenterY = courtHeight / 2;
  const threePtIntersectX = 142;
  const threePtLineYTop = 30;
  const threePtLineYBottom = 470;
  const threePtRadius = 237.5;

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <svg
        className="w-full h-auto drop-shadow-2xl"
        viewBox={`0 0 ${courtWidth} ${courtHeight}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Fondo */}
        <rect width={courtWidth} height={courtHeight} rx="16" ry="16" fill={COURT_FILL} />

        {/* Líneas en negro */}
        <g stroke={LINES_STROKE} strokeWidth="4" fill="none">
          <rect x="2" y="2" width={courtWidth - 4} height={courtHeight - 4} rx="16" ry="16" />
          <line x1={courtWidth / 2} y1="0" x2={courtWidth / 2} y2={courtHeight} />
          <circle cx={courtWidth / 2} cy={ftCircleCenterY} r={ftCircleRadius} />

          {/* Lado Izquierdo */}
          <rect x="0" y={keyY} width={keyLength} height={keyWidth} />
          <path d={`M ${keyLength} ${ftCircleCenterY - ftCircleRadius} A ${ftCircleRadius} ${ftCircleRadius} 0 0 1 ${keyLength} ${ftCircleCenterY + ftCircleRadius}`} />
          <path d={`M 0 ${threePtLineYTop} L ${threePtIntersectX} ${threePtLineYTop} A ${threePtRadius} ${threePtRadius} 0 0 1 ${threePtIntersectX} ${threePtLineYBottom} L 0 ${threePtLineYBottom}`} />

          {/* Lado Derecho */}
          <rect x={courtWidth - keyLength} y={keyY} width={keyLength} height={keyWidth} />
          <path d={`M ${courtWidth - keyLength} ${ftCircleCenterY - ftCircleRadius} A ${ftCircleRadius} ${ftCircleRadius} 0 0 0 ${courtWidth - keyLength} ${ftCircleCenterY + ftCircleRadius}`} />
          <path d={`M ${courtWidth} ${threePtLineYTop} L ${courtWidth - threePtIntersectX} ${threePtLineYTop} A ${threePtRadius} ${threePtRadius} 0 0 0 ${courtWidth - threePtIntersectX} ${threePtLineYBottom} L ${courtWidth} ${threePtLineYBottom}`} />
        </g>

        {/* Áreas interactivas */}
        <path
          {...mkAreaProps("center")}
          data-info="Fundado en 1945. ¡Corazón celeste y blanco!"
          d={`M${courtWidth / 2} ${ftCircleCenterY} m -${ftCircleRadius} 0 a ${ftCircleRadius} ${ftCircleRadius} 0 1 0 ${ftCircleRadius * 2} 0 a ${ftCircleRadius} ${ftCircleRadius} 0 1 0 -${ftCircleRadius * 2} 0`}
        />
        <rect
          {...mkAreaProps("leftKey")}
          data-info="La pintura: zona de gigantes y batallas."
          x="0"
          y={keyY}
          width={keyLength}
          height={keyWidth}
        />
        <rect
          {...mkAreaProps("rightKey")}
          data-info="Aquí se definen los partidos."
          x={courtWidth - keyLength}
          y={keyY}
          width={keyLength}
          height={keyWidth}
        />
      </svg>
    </div>
  );
}
