import React, { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import CheckInCard from './components/CheckInCard';

const HomePage = () => {
    const [checkIns, setCheckIns] = useState([]);
    const supabase = useSupabaseClient();

    useEffect(() => {
        const fetchCheckIns = async () => {
            const { data, error } = await supabase
                .from('check_ins')
                .select('*');
            if (error) console.error('Error fetching check-ins:', error);
            else setCheckIns(data);
        };
        fetchCheckIns();
    }, [supabase]);

    return (
        <div>
            <h1>Today's Check-ins</h1>
            <button onClick={() => window.location.href = '/check-in'}>Add Check-In</button>
            <div>
                {checkIns.map((checkIn, index) => (
                    <CheckInCard key={index} checkIn={checkIn} onReact={(reaction) => console.log(`Reacted with ${reaction}`)} />
                ))}
            </div>
        </div>
    );
};

export default HomePage;
