import React from 'react'

interface Props extends React.PropsWithChildren {
    className?: string
    onClick?: () => void
    direction: 'right' | 'left' | 'top' | 'bottom'
    disabled?: boolean
}

const ArrowButton: React.FC<Props> = ({
    className,
    onClick = () => null,
    direction,
    disabled,
}) => {
    className =
        className +
        'items-center justify-center flex hover:bg-gray-200/50 bg-gray-200/0 rounded-full p-2'
    return (
        <div>
            {direction === 'left' && (
                <button
                    disabled={disabled}
                    className={className}
                    onClick={() => onClick()}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.75}
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5L8.25 12l7.5-7.5"
                        />
                    </svg>
                </button>
            )}
            {direction === 'right' && (
                <button
                    disabled={disabled}
                    className={className}
                    onClick={() => onClick()}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.75}
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                    </svg>
                </button>
            )}
            {direction === 'top' && (
                <button
                    disabled={disabled}
                    className={className}
                    onClick={() => onClick()}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 15.75l7.5-7.5 7.5 7.5"
                        />
                    </svg>
                </button>
            )}
            {direction === 'bottom' && (
                <button
                    disabled={disabled}
                    className={className}
                    onClick={() => onClick()}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                    </svg>
                </button>
            )}
        </div>
    )
}

export default ArrowButton
