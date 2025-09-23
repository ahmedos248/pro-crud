import { useState, useEffect } from "react";

export function useResponsiveCards(defaultCount = 8) {
    const [cardsPerPage, setCardsPerPage] = useState(defaultCount);

    useEffect(() => {
        const update = () => {
            const w = window.innerWidth;
            if (w < 640) setCardsPerPage(4);
            else if (w < 1024) setCardsPerPage(6);
            else setCardsPerPage(defaultCount);
        };

        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [defaultCount]);

    return cardsPerPage;
}
