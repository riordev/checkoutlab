import React, { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

const CheckInPage = () => {
    const [mood, setMood] = useState('');
    const [morningWord, setMorningWord] = useState('');
    const [rose, setRose] = useState('');
    const [thorn, setThorn] = useState('');
    const [bud, setBud] = useState('');
    const supabase = useSupabaseClient();

    const handleSubmit = async (type) => {
        const { data, error } = await supabase
            .from('check_ins')
            .insert({ mood, morningWord, rose, thorn, bud, type });
        if (error) console.error('Error inserting data:', error);
        else console.log('Check-in submitted:', data);
    };

    const currentHour = new Date().getHours();
    const isMorning = currentHour < 12;

    return (
        <div className="glass-card">
            {isMorning ? (
                <div>
                    <h2>Morning Check-In</h2>
                    <div>
                        <button onClick={() => setMood('Great')}>😊 Great</button>
                        <button onClick={() => setMood('Okay')}>😐 Okay</button>
                        <button onClick={() => setMood('Not great')}>😔 Not great</button>
                    </div>
                    <input 
                        type="text"
                        placeholder="One word for today"
                        value={morningWord}
                        onChange={(e) => setMorningWord(e.target.value)}
                    />
                    <button onClick={() => handleSubmit('morning')}>Submit Morning Check-In</button>
                </div>
            ) : (
                <div>
                    <h2>Evening Check-In</h2>
                    <input 
                        type="text"
                        placeholder="Rose (Best part of day)"
                        value={rose}
                        onChange={(e) => setRose(e.target.value)}
                    />
                    <input 
                        type="text"
                        placeholder="Thorn (Challenge)"
                        value={thorn}
                        onChange={(e) => setThorn(e.target.value)}
                    />
                    <input 
                        type="text"
                        placeholder="Bud (Looking forward to)"
                        value={bud}
                        onChange={(e) => setBud(e.target.value)}
                    />
                    <button onClick={() => handleSubmit('evening')}>Submit Evening Check-In</button>
                </div>
            )}
        </div>
    );
};

export default CheckInPage;
