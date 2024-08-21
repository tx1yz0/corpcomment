import { useEffect, useState } from 'react'
import FeedbackItem from './FeedbackItem'
import Spinner from './Spinner'
import ErrorMessage from './ErrorMessage'
import { TFeedbackItem } from '../lib/types'

export default function FeedbackList() {
	const [feedbackItems, setFeedbackItems] = useState<TFeedbackItem[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	const handleAddToList = (text: string) => {
		const companyName = text
			.split(' ')
			.find((word) => word.startsWith('#'))!
			.substring(1)

		const newItem: TFeedbackItem = {
      id: new Date().getTime(),
			text: text,
			upvoteCount: 0,
			daysAgo: 0,
			companyName: companyName,
			badgeLetter: companyName.charAt(0).toUpperCase(),
		}

		setFeedbackItems([...feedbackItems, newItem])
	}

	useEffect(() => {
		const fetchFeedbackItems = async () => {
			setIsLoading(true)

			try {
				const response = await fetch(
					'https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks'
				)

				if (!response.ok) {
					throw new Error()
				}
				const data = await response.json()
				setFeedbackItems(data.feedbacks)
			} catch (error) {
				setErrorMessage('Something went wrong. Please try again later.')
			}

			setIsLoading(false)
		}
		fetchFeedbackItems()
	}, [])

	return (
		<ol className='feedback-list'>
			{isLoading && <Spinner />}

			{errorMessage && <ErrorMessage message={errorMessage} />}
			{feedbackItems.map((feedbackItem) => (
				<FeedbackItem key={feedbackItem.id} feedbackItem={feedbackItem} />
			))}
		</ol>
	)
}
