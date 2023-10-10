import clsx from 'clsx'
import React from 'react'

interface Props extends React.PropsWithChildren {
  onClick?: () => void
  className?: React.HTMLProps<HTMLElement>['className']
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'reset' | 'submit' | undefined
}

const Button: React.FC<Props> = ({
  onClick,
  className,
  size = 'sm',
  type = 'button',
  children,
}) => (
  <button
    type={type}
    onClick={onClick}
    className={clsx(
      'rounded bg-blue-600 text-white active:bg-blue-700',
      {
        'px-4 py-1.5 text-sm ': size === 'sm',
        'px-6 py-2 text-base': size === 'md',
        'px-8 py-2.5 text-lg': size === 'lg',
      },
      className
    )}
  >
    {children}
  </button>
)

export default Button
