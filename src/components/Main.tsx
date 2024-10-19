import { socket } from "@/socket";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import axios from "axios";
import { BASE_URL } from "@/config";

export default function Main() {
    const re = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/test`);
            console.log(response);
            console.log(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        re();
    }, []);

    return (
        <div className="App justify-center flex content-center items-center">
            <Button asChild>
                <Link to="/lobby">Join Room </Link>
            </Button>
            {/* <MyForm /> */}
        </div>
    );
}
