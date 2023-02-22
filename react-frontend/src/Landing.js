import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthProvider";

export const Landing = () => {
    const { value } = useAuth();
    console.log(value.username)
    return (
        <>
            <h2>Landing (Protected)</h2>
            <div> Authenticated as {value.username}</div>
            <div>
                <h1>My Contacts</h1>
                <ul>
                    {value.contacts.map((contact, index) => (
                        <li key={index}>{contact}</li>
                    ))}
                </ul>
            </div>
        </>
    );
};