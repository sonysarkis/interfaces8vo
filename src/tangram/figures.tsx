import React from 'react';

const TangramLoader = () => {
    const [isLoading, setIsLoading] = React.useState(true);

    // Simula una carga de datos
    React.useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 5000); // Simula una carga de 5 segundos
    }, []);

    return (
        <div>
            {isLoading ? (
                <TangramLoader />
            ) : (
                <h1>¡Contenido cargado!</h1>
            )}
        </div>
    );

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f0f0' }}>
            <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                {/* Triángulo Grande 1 */}
                <polygon id="triangle-large-1" points="0,0 100,100 0,200" fill="#FF5733">
                    <animate attributeName="fill" values="#FF5733;#33FF57;#5733FF;#FF5733" dur="4s" repeatCount="indefinite" />
                </polygon>

                {/* Triángulo Grande 2 */}
                <polygon id="triangle-large-2" points="100,100 200,0 200,200" fill="#33FF57">
                    <animate attributeName="fill" values="#33FF57;#5733FF;#FF5733;#33FF57" dur="4s" repeatCount="indefinite" begin="0.5s" />
                </polygon>

                {/* Triángulo Mediano */}
                <polygon id="triangle-medium" points="100,0 150,50 50,50" fill="#5733FF">
                    <animate attributeName="fill" values="#5733FF;#FF5733;#33FF57;#5733FF" dur="4s" repeatCount="indefinite" begin="1s" />
                </polygon>

                {/* Triángulo Pequeño 1 */}
                <polygon id="triangle-small-1" points="0,0 50,50 0,100" fill="#FFBD33">
                    <animate attributeName="fill" values="#FFBD33;#33FFBD;#BD33FF;#FFBD33" dur="4s" repeatCount="indefinite" begin="1.5s" />
                </polygon>

                {/* Triángulo Pequeño 2 */}
                <polygon id="triangle-small-2" points="150,50 200,100 150,150" fill="#33FFBD">
                    <animate attributeName="fill" values="#33FFBD;#BD33FF;#FFBD33;#33FFBD" dur="4s" repeatCount="indefinite" begin="2s" />
                </polygon>

                {/* Cuadrado */}
                <polygon id="square" points="50,50 100,0 150,50 100,100" fill="#BD33FF">
                    <animate attributeName="fill" values="#BD33FF;#FFBD33;#33FFBD;#BD33FF" dur="4s" repeatCount="indefinite" begin="2.5s" />
                </polygon>

                {/* Paralelogramo */}
                <polygon id="parallelogram" points="0,100 50,150 150,150 100,200" fill="#33BDFF">
                    <animate attributeName="fill" values="#33BDFF;#FF33BD;#BDFF33;#33BDFF" dur="4s" repeatCount="indefinite" begin="3s" />
                </polygon>
            </svg>

            <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from="0 100 100"
                to="360 100 100"
                dur="10s"
                repeatCount="indefinite" />
        </div>
    );
};

export default TangramLoader;