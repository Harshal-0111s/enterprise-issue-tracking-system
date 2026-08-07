import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/ticketApi";

function Reports() {

    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {

        try {

            const response = await API.get("/tickets");

            setTickets(response.data.tickets || []);

        } catch (err) {

            console.log(err);

        }

    };

    return (

        <div>

            <Sidebar />

            <div className="dashboard-content">

                <Navbar />

                <div className="main-content">

                    <h1>Reports</h1>

                    <h3>Total Tickets : {tickets.length}</h3>

                    <table>

                        <thead>

                            <tr>

                                <th>Status</th>
                                <th>Total</th>

                            </tr>

                        </thead>

                        <tbody>

                            <tr>
                                <td>Open</td>
                                <td>{tickets.filter(t => t.status === "Open").length}</td>
                            </tr>

                            <tr>
                                <td>In Progress</td>
                                <td>{tickets.filter(t => t.status === "In Progress").length}</td>
                            </tr>

                            <tr>
                                <td>Resolved</td>
                                <td>{tickets.filter(t => t.status === "Resolved").length}</td>
                            </tr>

                            <tr>
                                <td>Closed</td>
                                <td>{tickets.filter(t => t.status === "Closed").length}</td>
                            </tr>

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}

export default Reports;