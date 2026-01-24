import '../styles/globals.css';
import React from 'react';
import Header from '../components/Header';

export const metadata = {
	title: 'Novena Católica',
	description: 'Reze as novenas com facilidade',
};

export const viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="pt-BR">
			<head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
				/>
			</head>
			<body>
				<main className="min-h-screen p-4 sm:p-6">
					<div className="devotional-container max-w-4xl mx-auto">
						<Header />
						{children}
					</div>
				</main>
			</body>
		</html>
	);
}
