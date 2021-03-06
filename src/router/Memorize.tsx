import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SelectTable from "../components/SelectTable";
import { shuffleArray } from "../utils";
import Loader from "../components/Loader";
import { ListIcon, HomeIcon, RenewIcon, DoneIcon } from "../components/Icons";

import "./Memorize.css";

function MemorizeWords(props: MemorizeWordsProps) {
    const [index, setIndex] = useState<number>(0);
    const [done, setDone] = useState(false);
    const [reveal, setReveal] = useState(false);
    const { data } = props;
    const { length } = data;

    const wordSwapInterval = 3000;
    const wordRevealInterval = 2000;

    const increaseIndex = () => {
        if (index === length - 1) {
            setDone(true);
        } else {
            setIndex(index + 1);
            setReveal(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(increaseIndex, wordSwapInterval);
        const reveal = setTimeout(() => setReveal(true), wordRevealInterval);

        document.documentElement.classList.remove("aware");

        return () => {
            clearTimeout(timer);
            clearTimeout(reveal);
        };
    }, [index, setIndex]);

    if (done) {
        return (
            <div className="center-container done">
                <h2 className="done__title">Done 🎉</h2>
                <div className="done__buttons">
                    <Link className="done__button" to="/">
                        <HomeIcon />
                    </Link>
                    <button
                        className="done__button"
                        onClick={() => {
                            shuffleArray(data);
                            setIndex(0);
                            setReveal(false);
                            setDone(false);
                        }}
                    >
                        <RenewIcon />
                    </button>
                </div>
            </div>
        );
    } else {
        const currentWord = data[index];

        return (
            <div className="memorize">
                <h2 className="memorize__word">
                    <div>{currentWord.word}</div>
                </h2>
                <ul
                    className={`memorize__meaning memorize__hidden${
                        reveal ? " reveal" : ""
                    }`}
                >
                    {currentWord.meaning.map((meaning, index) => {
                        return <li key={index}>{meaning}</li>;
                    })}
                </ul>
                <button className="memorize__aware" onClick={increaseIndex}>
                    <DoneIcon /> I know this
                </button>
            </div>
        );
    }
}

export default function Memorize() {
    const [data, setData] = useState<word[]>();

    const fetchWords = () => {
        fetch("https://words-api.marshall-ku.com/words/today")
            .then((response) => {
                try {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error("Couldn't fetch data");
                    }
                } catch (error) {
                    throw new Error("Couldn't parse data");
                }
            })
            .then((response: word[]) => {
                setData(response);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        fetchWords();
    }, []);

    if (data) {
        return <MemorizeWords data={data} />;
    } else {
        return (
            <div className="center-container">
                <Loader />
            </div>
        );
    }
}
