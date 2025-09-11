import { useEffect, useState } from "react";
import Card from "../components/Card";


export default function Products({ darkMode }) {
    const [cards, setCards] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5001/cards")
            .then(res => res.json())
            .then(data => setCards(data))
            .catch(err => console.error("Fetch error:", err));
    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6 auto-rows-min">
            {cards.map(card => (
                <div key={card.id} className="flex-none">
                    <Card imgSrc={card.img} alt={card.alt} darkMode={darkMode} />
                </div>
            ))}
        </div>
    );
}
