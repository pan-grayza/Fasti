import clsx from 'clsx'

interface Props extends React.PropsWithChildren {
  className?: string
}

const Cell: React.FC<Props> = ({ children, className }) => {
  return (
    <div
      className={clsx(
        'flex select-none items-center justify-center border-l transition-colors',

        className
      )}
    >
      <p className="opacity-50">{children}</p>
    </div>
  )
}

export default Cell
