import clsx from 'clsx'

interface Props extends React.PropsWithChildren {
    className?: string
}

const Cell: React.FC<Props> = ({ children, className }) => {
    return (
        <div
            className={clsx(
                'border-l flex items-center justify-center select-none transition-colors',

                className
            )}
        >
            {children}
        </div>
    )
}

export default Cell
