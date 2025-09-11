export default function BackgroundTexture({ darkMode }) {
    return (
        <div className="absolute inset-0 -z-10 pointer-events-none">
            {darkMode ? (
                // Grid (dark mode) - subtle
                <div
                    className="w-full h-full"
                    style={{
                        backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)
            `,
                        backgroundSize: "60px 60px",
                    }}
                />
            ) : (
                // Dots (light mode) - light green
                <div
                    className="w-full h-full"
                    style={{
                        backgroundImage: `
              radial-gradient(circle, rgba(134,239,172,0.4) 3px, transparent 1px)
            `,
                        backgroundSize: "40px 40px",
                    }}
                />
            )}
        </div>
    );
}
