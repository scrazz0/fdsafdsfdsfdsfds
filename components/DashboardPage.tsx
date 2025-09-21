import React, { useEffect, useState } from 'react';
import { Routes, Route, NavLink, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import type { Socket } from 'socket.io-client';

const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const PropertiesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
const WalletIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
const ProfileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;

const DASHBOARD_LINKS = [
    { path: "", name: "Dashboard", icon: <DashboardIcon /> },
    { path: "properties", name: "My Properties", icon: <PropertiesIcon /> },
    { path: "wallet", name: "Wallet", icon: <WalletIcon /> },
    { path: "profile", name: "Profile", icon: <ProfileIcon /> },
];

const DashboardHome = () => (
    <div>
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-md">
                <h3 className="text-text-muted-light dark:text-text-muted-dark">Total Investment</h3>
                <p className="text-4xl font-bold text-primary dark:text-primary-dark mt-2">$125,000</p>
            </div>
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-md">
                <h3 className="text-text-muted-light dark:text-text-muted-dark">Total Income</h3>
                <p className="text-4xl font-bold text-green-500 mt-2">$8,750</p>
            </div>
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-md">
                <h3 className="text-text-muted-light dark:text-text-muted-dark">Portfolio Yield</h3>
                <p className="text-4xl font-bold mt-2">7.0%</p>
            </div>
        </div>
        <div className="mt-8 bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-md">
            <h3 className="font-bold text-xl mb-4">Transaction History</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b dark:border-gray-700">
                            <th className="p-3">Date</th>
                            <th className="p-3">Description</th>
                            <th className="p-3">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b dark:border-gray-700"><td className="p-3">2023-10-01</td><td className="p-3">Rental Income: Serene Downtown Loft</td><td className="p-3 text-green-500">+$43.33</td></tr>
                        <tr className="border-b dark:border-gray-700"><td className="p-3">2023-09-15</td><td className="p-3">Investment: Chic Parisian Apartment</td><td className="p-3 text-red-500">-$12,000</td></tr>
                        <tr><td className="p-3">2023-09-01</td><td className="p-3">Deposit from Bank</td><td className="p-3 text-green-500">+$50,000</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

const MyProperties = ({ socket }: { socket: Socket }) => {
    const [properties, setProperties] = useState([]);
    const [newProperty, setNewProperty] = useState({
        title: '', location: '', city: '', type: '', yield: 0, fullPrice: 0, minShare: 0, imageUrl: '', description: '', details: { bedrooms: 0, bathrooms: 0, area: 0 }
    });

    useEffect(() => {
        const fetchProperties = async () => {
            const res = await api.get('/properties');
            setProperties(res.data);
        };
        fetchProperties();

        socket.on('new-property', (prop) => {
            setProperties(prev => [...prev, prop]);
        });

        return () => socket.off('new-property');
    }, [socket]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('details.')) {
            const detailKey = name.split('.')[1];
            setNewProperty(prev => ({
                ...prev,
                details: { ...prev.details, [detailKey]: Number(value) || value }
            }));
        } else {
            setNewProperty(prev => ({ ...prev, [name]: Number(value) || value }));
        }
    };

    const handleAddProperty = async (e) => {
        e.preventDefault();
        await api.post('/properties', newProperty);
        setNewProperty({ title: '', location: '', city: '', type: '', yield: 0, fullPrice: 0, minShare: 0, imageUrl: '', description: '', details: { bedrooms: 0, bathrooms: 0, area: 0 } });
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">My Properties</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map(p => (
                    <div key={p.id} className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl">
                        <h3>{p.title}</h3>
                        <p>{p.location}</p>
                    </div>
                ))}
            </div>
            <div className="mt-8 bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-md">
                <h3 className="font-bold text-xl mb-4">Add New Property</h3>
                <form onSubmit={handleAddProperty} className="space-y-4">
                    <input name="title" placeholder="Title" value={newProperty.title} onChange={handleChange} className="w-full p-3 border dark:border-gray-600 rounded-md" />
                    <input name="location" placeholder="Location" value={newProperty.location} onChange={handleChange} className="w-full p-3 border dark:border-gray-600 rounded-md" />
                    <input name="city" placeholder="City" value={newProperty.city} onChange={handleChange} className="w-full p-3 border dark:border-gray-600 rounded-md" />
                    <input name="type" placeholder="Type" value={newProperty.type} onChange={handleChange} className="w-full p-3 border dark:border-gray-600 rounded-md" />
                    <input name="yield" type="number" placeholder="Yield (%)" value={newProperty.yield} onChange={handleChange} className="w-full p-3 border dark:border-gray-600 rounded-md" />
                    <input name="fullPrice" type="number" placeholder="Full Price" value={newProperty.fullPrice} onChange={handleChange} className="w-full p-3 border dark:border-gray-600 rounded-md" />
                    <input name="minShare" type="number" placeholder="Min Share" value={newProperty.minShare} onChange={handleChange} className="w-full p-3 border dark:border-gray-600 rounded-md" />
                    <input name="imageUrl" placeholder="Image URL" value={newProperty.imageUrl} onChange={handleChange} className="w-full p-3 border dark:border-gray-600 rounded-md" />
                    <textarea name="description" placeholder="Description" value={newProperty.description} onChange={handleChange} className="w-full p-3 border dark:border-gray-600 rounded-md" />
                    <input name="details.bedrooms" type="number" placeholder="Bedrooms" value={newProperty.details.bedrooms} onChange={handleChange} className="w-full p-3 border dark:border-gray-600 rounded-md" />
                    <input name="details.bathrooms" type="number" placeholder="Bathrooms" value={newProperty.details.bathrooms} onChange={handleChange} className="w-full p-3 border dark:border-gray-600 rounded-md" />
                    <input name="details.area" type="number" placeholder="Area (m²)" value={newProperty.details.area} onChange={handleChange} className="w-full p-3 border dark:border-gray-600 rounded-md" />
                    <button type="submit" className="w-full bg-primary text-white py-2 rounded-full">Add Property</button>
                </form>
            </div>
        </div>
    );
};

const Wallet = () => {
    const [amount, setAmount] = useState('');
    const [address, setAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleWithdraw = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post('/wallet/withdraw', { amount, address });
            setMessage({ type: 'success', text: 'Notification sent successfully.' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to send notification.' });
        }
        setIsLoading(false);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Wallet</h1>
            <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-xl shadow-md">
                <form onSubmit={handleWithdraw} className="space-y-4">
                    <input type="number" placeholder="Amount (USD)" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-3 border dark:border-gray-600 rounded-md" />
                    <input type="text" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} className="w-full p-3 border dark:border-gray-600 rounded-md" />
                    <button type="submit" disabled={isLoading} className="w-full bg-primary text-white font-semibold py-2 px-4 rounded-full hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed">
                        {isLoading ? 'Submitting...' : 'Request Withdrawal'}
                    </button>
                    {message.text && (
                        <p className={`text-sm mt-2 ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                            {message.text}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

const Profile = () => {
    const [user, setUser] = useState({ name: '', email: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/profile');
                setUser(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put('/profile', { name: user.name });
            alert('Changes saved');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
            <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-xl shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium">Full Name</label>
                        <input type="text" id="name" value={user.name} onChange={e => setUser({...user, name: e.target.value})} className="mt-1 block w-full px-3 py-2 bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium">Email</label>
                        <input type="email" id="email" value={user.email} disabled className="mt-1 block w-full px-3 py-2 bg-gray-200 dark:bg-gray-700 border rounded-md" />
                    </div>
                    <div>
                        <button type="submit" className="bg-primary text-white font-semibold py-2 px-6 rounded-full hover:bg-opacity-90">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const DashboardLayout: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');
        navigate('/');
    };
    
    return (
        <div className="flex min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
            <aside className="w-64 bg-surface-light dark:bg-surface-dark p-6 flex-shrink-0 flex flex-col shadow-lg">
                <Link to="/" className="text-3xl font-bold font-serif text-primary dark:text-primary-dark mb-10">
                    Elysian Estates
                </Link>
                <nav className="flex-grow">
                    {DASHBOARD_LINKS.map(link => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            end={link.path === ""}
                            className={({ isActive }) =>
                                `flex items-center space-x-3 p-3 my-2 rounded-lg transition-colors ${isActive ? 'bg-primary/20 text-primary dark:text-primary-dark' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`
                            }
                        >
                            {link.icon}
                            <span>{link.name}</span>
                        </NavLink>
                    ))}
                </nav>
                <div>
                    <button onClick={handleLogout} className="flex items-center space-x-3 p-3 w-full text-left rounded-lg transition-colors hover:bg-red-500/10 hover:text-red-500">
                        <LogoutIcon />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
            <main className="flex-1 p-10 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

export default function DashboardPage({ socket }: { socket: Socket }) {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <DashboardLayout>
            <Routes>
                <Route index element={<DashboardHome />} />
                <Route path="properties" element={<MyProperties socket={socket} />} />
                <Route path="wallet" element={<Wallet />} />
                <Route path="profile" element={<Profile />} />
            </Routes>
        </DashboardLayout>
    );
}