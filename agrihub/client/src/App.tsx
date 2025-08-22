import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const apiBase = 'http://localhost:3001/api';

type Role = 'farmer' | 'buyer' | null;

function Navbar({ role, onRoleChange }: { role: Role; onRoleChange: (r: Role) => void }) {
	const { t, i18n } = useTranslation();
	return (
		<nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-emerald-100">
			<div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<span className="text-2xl font-extrabold text-emerald-700">AgriHub</span>
					<span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Beta</span>
				</div>
				<div className="flex items-center gap-4">
					<button onClick={() => onRoleChange(null)} className="text-sm text-emerald-700 hover:text-emerald-900">
						{t('home')}
					</button>
					<a className="text-sm hover:text-emerald-900" href="#news">
						{t('news')}
					</a>
					<a className="text-sm hover:text-emerald-900" href="#prices">
						{t('marketPrice')}
					</a>
					<a className="text-sm hover:text-emerald-900" href="#resources">
						{t('resources')}
					</a>
					<a className="text-sm hover:text-emerald-900" href="#status">
						{t('status')}
					</a>
					{role === 'farmer' && (
						<a className="text-sm hover:text-emerald-900" href="#sell">
							{t('sell')}
						</a>
					)}
					{role === 'buyer' && (
						<a className="text-sm hover:text-emerald-900" href="#buy">
							{t('buy')}
						</a>
					)}
					<div className="h-5 w-px bg-emerald-200" />
					<select
						className="text-sm bg-white border border-emerald-200 rounded px-2 py-1"
						value={i18n.language}
						onChange={(e) => i18n.changeLanguage(e.target.value)}
					>
						<option value="en">EN</option>
						<option value="hi">हिंदी</option>
					</select>
					<button className="text-sm text-white bg-emerald-600 hover:bg-emerald-700 rounded px-3 py-1">
						{t('login')}
					</button>
					<button className="text-sm text-emerald-700 border border-emerald-300 hover:bg-emerald-50 rounded px-3 py-1">
						{t('signin')}
					</button>
				</div>
			</div>
		</nav>
	);
}

function Landing({ onPick }: { onPick: (r: Exclude<Role, null>) => void }) {
	const { t } = useTranslation();
	return (
		<section className="min-h-[70vh] grid place-items-center bg-gradient-to-br from-emerald-50 to-white">
			<div className="max-w-5xl mx-auto text-center px-4">
				<h1 className="text-4xl md:text-6xl font-extrabold text-emerald-800">Empowering Agriculture</h1>
				<p className="mt-3 text-emerald-700">Smart tools for farmers and buyers: prices, news, resources, and more.</p>
				<div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
					<button
						onClick={() => onPick('farmer')}
						className="p-6 rounded-2xl bg-white border border-emerald-100 shadow-sm hover:shadow-md transition text-left"
					>
						<div className="text-2xl font-bold text-emerald-700">{t('farmer')}</div>
						<p className="text-emerald-600 mt-2">Sell crops, see market prices, manage resources</p>
					</button>
					<button
						onClick={() => onPick('buyer')}
						className="p-6 rounded-2xl bg-white border border-emerald-100 shadow-sm hover:shadow-md transition text-left"
					>
						<div className="text-2xl font-bold text-emerald-700">{t('buyer')}</div>
						<p className="text-emerald-600 mt-2">Buy crops, request resources, market insights</p>
					</button>
				</div>
			</div>
		</section>
	);
}

function News() {
	const [items, setItems] = useState<any[]>([]);
	useEffect(() => {
		fetch(`${apiBase}/news`).then((r) => r.json()).then(setItems).catch(() => {});
	}, []);
	return (
		<section id="news" className="max-w-7xl mx-auto px-4 py-10">
			<h2 className="text-2xl font-bold text-emerald-800">News & Schemes</h2>
			<div className="grid md:grid-cols-3 gap-4 mt-4">
				{items.map((n, idx) => (
					<a key={idx} href={n.link} target="_blank" className="p-4 border rounded-xl hover:bg-emerald-50">
						<div className="font-semibold text-emerald-800">{n.title}</div>
						<div className="text-sm text-emerald-600 mt-1">{n.contentSnippet}</div>
						<div className="text-xs text-emerald-500 mt-2">{n.pubDate}</div>
					</a>
				))}
			</div>
		</section>
	);
}

function Prices() {
	const [query, setQuery] = useState('');
	const [prices, setPrices] = useState<Record<string, number>>({});
	useEffect(() => {
		fetch(`${apiBase}/prices`).then((r) => r.json()).then(setPrices);
	}, []);
	const visible = Object.entries(prices).filter(([k]) => k.includes(query.toLowerCase()));
	return (
		<section id="prices" className="max-w-7xl mx-auto px-4 py-10">
			<h2 className="text-2xl font-bold text-emerald-800">Market Prices</h2>
			<input
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				placeholder="Search crop..."
				className="mt-3 w-full md:w-80 border rounded px-3 py-2"
			/>
			<div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
				{visible.map(([crop, price]) => (
					<div key={crop} className="p-4 border rounded-xl bg-white">
						<div className="font-semibold text-emerald-800 capitalize">{crop}</div>
						<div className="text-emerald-600">₹ {price}/quintal</div>
					</div>
				))}
			</div>
		</section>
	);
}

function Sell() {
	const [crop, setCrop] = useState('');
	const [price, setPrice] = useState<number | null>(null);
	const [quantity, setQuantity] = useState('');
	const [location, setLocation] = useState('');
	const [phone, setPhone] = useState('');
	useEffect(() => {
		if (crop) {
			fetch(`${apiBase}/price/${crop}`)
				.then(async (r) => {
					if (r.ok) {
						const d = await r.json();
						setPrice(d.price);
					} else {
						setPrice(null);
					}
				})
				.catch(() => setPrice(null));
		} else {
			setPrice(null);
		}
	}, [crop]);
	const submit = (e: any) => {
		e.preventDefault();
		fetch(`${apiBase}/status`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ type: 'sell', crop, quantity, location, price })
		}).then(() => alert('Submitted'));
	};
	const dial = async () => {
		if (!confirm('Are you sure you want us to call you?')) return;
		await fetch(`${apiBase}/dial`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ phone, cropName: crop, quantity, location })
		});
		alert('We will call you shortly');
	};
	return (
		<section id="sell" className="max-w-2xl mx-auto px-4 py-10">
			<h2 className="text-2xl font-bold text-emerald-800">Sell Crops</h2>
			<form onSubmit={submit} className="mt-4 space-y-4">
				<div>
					<label className="block text-sm text-emerald-700">Crop Name</label>
					<input value={crop} onChange={(e) => setCrop(e.target.value)} placeholder="e.g., wheat" className="w-full border rounded px-3 py-2" />
					{price !== null && <div className="text-sm text-emerald-600 mt-1">Market Price: ₹ {price}/quintal</div>}
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm text-emerald-700">Quantity (quintal)</label>
						<input value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full border rounded px-3 py-2" />
					</div>
					<div>
						<label className="block text-sm text-emerald-700">Location</label>
						<input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full border rounded px-3 py-2" />
					</div>
				</div>
				<div>
					<label className="block text-sm text-emerald-700">Phone</label>
					<input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border rounded px-3 py-2" />
				</div>
				<div className="flex gap-3">
					<button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700">
						Submit
					</button>
					<button type="button" onClick={dial} className="border border-emerald-300 text-emerald-700 px-4 py-2 rounded hover:bg-emerald-50">
						Dial for Help
					</button>
				</div>
			</form>
		</section>
	);
}

function Buy() {
	const [crop, setCrop] = useState('');
	const [quantity, setQuantity] = useState('');
	const submit = (e: any) => {
		e.preventDefault();
		fetch(`${apiBase}/status`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ type: 'buy', crop, quantity })
		});
		alert('Request submitted');
	};
	return (
		<section id="buy" className="max-w-2xl mx-auto px-4 py-10">
			<h2 className="text-2xl font-bold text-emerald-800">Buy Crops</h2>
			<form onSubmit={submit} className="mt-4 space-y-4">
				<div>
					<label className="block text-sm text-emerald-700">Crop Name</label>
					<input value={crop} onChange={(e) => setCrop(e.target.value)} className="w-full border rounded px-3 py-2" />
				</div>
				<div>
					<label className="block text-sm text-emerald-700">Quantity (quintal)</label>
					<input value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full border rounded px-3 py-2" />
				</div>
				<button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700">
					Submit
				</button>
			</form>
		</section>
	);
}

function Resources() {
	const [kind, setKind] = useState('drone');
	const [mode, setMode] = useState<'rent' | 'give'>('rent');
	const [note, setNote] = useState('');
	const submit = (e: any) => {
		e.preventDefault();
		fetch(`${apiBase}/resources`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ mode, kind, note })
		}).then(() => alert('Request posted'));
	};
	return (
		<section id="resources" className="max-w-3xl mx-auto px-4 py-10">
			<h2 className="text-2xl font-bold text-emerald-800">Resources</h2>
			<form onSubmit={submit} className="mt-4 grid md:grid-cols-4 gap-4">
				<select value={mode} onChange={(e) => setMode(e.target.value as any)} className="border rounded px-3 py-2">
					<option value="rent">Take on Rent</option>
					<option value="give">Give on Rent</option>
				</select>
				<select value={kind} onChange={(e) => setKind(e.target.value)} className="border rounded px-3 py-2">
					<option value="drone">Drone</option>
					<option value="tractor">Tractor</option>
					<option value="seeds">Seeds</option>
					<option value="equipment">Equipment</option>
				</select>
				<input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Describe your need/offer" className="border rounded px-3 py-2 md:col-span-2" />
				<button className="bg-emerald-600 text-white px-4 py-2 rounded">Post</button>
			</form>
		</section>
	);
}

function Status() {
	const [items, setItems] = useState<any[]>([]);
	useEffect(() => {
		fetch(`${apiBase}/status`).then((r) => r.json()).then(setItems);
	}, []);
	return (
		<section id="status" className="max-w-7xl mx-auto px-4 py-10">
			<h2 className="text-2xl font-bold text-emerald-800">Status</h2>
			<div className="grid md:grid-cols-2 gap-4 mt-4">
				{items.map((it) => (
					<div key={it.id} className="p-4 border rounded-xl bg-white">
						<div className="text-sm text-emerald-600">{it.type?.toUpperCase()}</div>
						<div className="font-semibold text-emerald-800">{it.crop || it.kind}</div>
						{it.quantity && <div className="text-emerald-700">Qty: {it.quantity}</div>}
						{it.price && <div className="text-emerald-700">Price: ₹ {it.price}</div>}
						{it.note && <div className="text-emerald-700">{it.note}</div>}
					</div>
				))}
			</div>
		</section>
	);
}

function AiDetector() {
	const [file, setFile] = useState<File | null>(null);
	const [result, setResult] = useState<string | null>(null);
	const analyze = async () => {
		if (!file) return;
		setResult('Analyzing...');
		setTimeout(() => setResult('Healthy 🌿 (demo)'), 1200);
	};
	return (
		<section id="ai" className="max-w-2xl mx-auto px-4 py-10">
			<h2 className="text-2xl font-bold text-emerald-800">AI Crop Health</h2>
			<div className="mt-4 space-y-3">
				<input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
				<button onClick={analyze} className="bg-emerald-600 text-white px-4 py-2 rounded">
					Analyze
				</button>
				{result && <div className="p-3 bg-emerald-50 border border-emerald-200 rounded">{result}</div>}
			</div>
		</section>
	);
}

export default function App() {
	const [role, setRole] = useState<Role>(null);
	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(() => {}, () => {});
		}
	}, []);
	return (
		<div className="min-h-screen">
			<Navbar role={role} onRoleChange={setRole} />
			{!role && <Landing onPick={setRole} />}
			{role === 'farmer' && (
				<>
					<Sell />
					<AiDetector />
					<Resources />
					<Status />
					<Prices />
					<News />
				</>
			)}
			{role === 'buyer' && (
				<>
					<Buy />
					<Resources />
					<Status />
					<Prices />
					<News />
				</>
			)}
			<footer className="mt-10 border-t bg-white">
				<div className="max-w-7xl mx-auto px-4 py-8 text-sm text-emerald-700">© {new Date().getFullYear()} AgriHub</div>
			</footer>
		</div>
	);
}
