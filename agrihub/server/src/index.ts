import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Parser from 'rss-parser';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Mock price data; replace with real API later
const cropPriceMap: Record<string, number> = {
	wheat: 2200,
	rice: 2800,
	corn: 2100,
	cotton: 6500,
	soybean: 4500,
	sugarcane: 3300
};

app.get('/api/prices', (req, res) => {
	const q = (req.query.q as string)?.toLowerCase();
	if (!q) {
		return res.json(cropPriceMap);
	}
	const filtered = Object.fromEntries(
		Object.entries(cropPriceMap).filter(([k]) => k.includes(q))
	);
	res.json(filtered);
});

app.get('/api/price/:crop', (req, res) => {
	const crop = req.params.crop.toLowerCase();
	const price = cropPriceMap[crop];
	if (!price) return res.status(404).json({ error: 'Not found' });
	res.json({ crop, price });
});

// Dial endpoint (mock)
app.post('/api/dial', (req, res) => {
	const { phone, cropName, quantity, location } = req.body || {};
	console.log('Dial request:', { phone, cropName, quantity, location });
	// TODO: Integrate with telephony (e.g., Twilio)
	res.json({ ok: true, message: 'Our team will contact you shortly.' });
});

// Status endpoints (mock)
let statuses: any[] = [];
app.get('/api/status', (req, res) => {
	res.json(statuses);
});
app.post('/api/status', (req, res) => {
	const entry = { id: Date.now(), ...req.body };
	statuses.push(entry);
	res.json(entry);
});

// Resources endpoints (mock)
let resourceRequests: any[] = [];
app.get('/api/resources', (req, res) => {
	res.json(resourceRequests);
});
app.post('/api/resources', (req, res) => {
	const entry = { id: Date.now(), ...req.body };
	resourceRequests.push(entry);
	res.json(entry);
});

// News via RSS
const parser = new Parser();
const feeds = [
	'https://www.fao.org/feeds/agrinews.xml',
	'https://www.usda.gov/media/press-releases/rss',
	'https://www.thehindu.com/sci-tech/agriculture/feeder/default.rss'
];

app.get('/api/news', async (_req, res) => {
	try {
		const results = await Promise.allSettled(
			feeds.map((f) => parser.parseURL(f))
		);
		const items = (results as PromiseFulfilledResult<any>[])
			.flatMap((r: any) => (r.status === 'fulfilled' ? r.value.items : []))
			.slice(0, 30);
		res.json(
			items.map((i: any) => ({
				title: i.title,
				link: i.link,
				pubDate: i.pubDate,
				contentSnippet: i.contentSnippet
			}))
		);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: 'Failed to fetch news' });
	}
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});