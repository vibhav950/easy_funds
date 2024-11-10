import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/SideBar';
import FundInfo from '../components/FundInfo';
import FundGraph from '../components/FundGraph';
import FundList from '../components/FundList';

export default function FundScreen() {
    const [fundData, setFundData] = useState(null);
    const [graphData, setGraphData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { fundId, uid } = location.state;
    console.log(location.state);

    useEffect(() => {
        if (!uid || !fundId) {
            navigate('/');
            return;
        }


        const fetchFundData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/fund?f_id=${fundId}`);
                setFundData(response.data);
            } catch (error) {
                console.error('Error fetching fund data:', error);
                setError("Failed to load fund data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        const fetchGraphData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/fund/graph_data?f_id=${fundId}`);
                setGraphData(response.data);
            } catch (error) {
                console.error('Error fetching graph data:', error);
                setError("Failed to load graph data. Please try again later.");
            }
        };

        fetchFundData();
        fetchGraphData();
    }, [fundId, uid, navigate]);

    const handleFundClick = (fundId) => {
        navigate('/fund', { state: { fundId, uid } });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Sidebar uid={uid} />
            <main className="ml-64 p-8">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    ) : (
                        fundData && (
                            <div>
                                <FundInfo info={fundData.info} />
                                <FundGraph graphData={graphData} />
                                <FundList title="Other Funds in Same Category" funds={fundData.same_category} onFundClick={handleFundClick} />
                                <FundList title="Other Funds in Same Company" funds={fundData.same_company} onFundClick={handleFundClick} />
                            </div>
                        )
                    )}
                </div>
            </main>
        </div>
    );
}