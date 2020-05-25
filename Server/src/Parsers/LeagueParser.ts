import Data from "../Models/Data";

export default function LeagueParser(): Data[] {
	function getFullUrl(url: string): string {
		const baseUrl = "https://na.leagueoflegends.com/";
		if (url.startsWith("/")) {
			return baseUrl + url;
		}
		return url;
	}

	function getAuthors(cardInfo: HTMLElement): string[] {
		const authorDiv: HTMLInputElement = cardInfo.lastChild.lastChild as HTMLInputElement;
		const authors = authorDiv.getElementsByTagName("span");
		if (authors && authors.length > 0) {
			const authorText = authors[0].textContent;
			const authorArray = authorText.split(",").map((auth) => {
				return auth.trim();
			});
			return authorArray;
		} else {
			return null;
		}
	}

	function getImageUrl(card: HTMLElement): string {
		const imageParent: HTMLInputElement = card.firstChild as HTMLInputElement;
		const imageElement = imageParent.getElementsByTagName("img");
		if (imageElement && imageElement.length > 0) {
			return imageElement[0].getAttribute("src");
		}
		return null;
	}

	// TODO: Download the image, eventually some filtering?
	let documents = [];
	const newsList = document.getElementsByTagName("ol")[1];
	const newsCards = newsList.getElementsByTagName("a");
	for (let i = 0; i < newsCards.length; i++) {
		const card: HTMLElement = newsCards[i];
		const cardInfo: HTMLInputElement = card.lastChild.lastChild as HTMLInputElement;

		const link: string = getFullUrl(card.getAttribute("href"));
		const title: string = cardInfo.getElementsByTagName("h2")[0].innerText;
		const datetime: Date = new Date(
			cardInfo.getElementsByTagName("time")[0].getAttribute("datetime")
		);
		const authors: string[] = getAuthors(cardInfo);
		const imageUrl: string = getImageUrl(card);

		const document: Data = {
			link: link,
			title: title,
			datetime: datetime,
			authors: authors,
			imageUrl: imageUrl,
		};
		documents.push(document);
	}
	return documents;
}
