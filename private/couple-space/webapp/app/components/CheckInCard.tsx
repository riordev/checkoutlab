import React from 'react';

const CheckInCard = ({ checkIn, onReact }) => {
    return (
        <div className="glass-card">
            <h3>{checkIn.partner}'s Check-In</h3>
            <p>Mood: {checkIn.mood}</p>
            {checkIn.type === 'morning' && <p>One word for today: {checkIn.morningWord}</p>}
            {checkIn.type === 'evening' && (
                <>
                    <p>Rose: {checkIn.rose}</p>
                    <p>Thorn: {checkIn.thorn}</p>
                    <p>Bud: {checkIn.bud}</p>
                </>
            )}
            <div className="reactions">
                <button onClick={() => onReact('heart')}>❤️</button>
                <button onClick={() => onReact('hug')}>🤗</button>
            </div>
        </div>
    );
};

export default CheckInCard;
