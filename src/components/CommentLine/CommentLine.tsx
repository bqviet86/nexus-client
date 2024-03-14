type CommentLineProps = {
    className?: string
    children: React.ReactNode
}

function CommentLine({ className = '', children }: CommentLineProps) {
    return (
        <div className='relative ml-11 h-max'>
            <div
                className={`absolute bottom-[calc(50%-1px)] right-[calc(100%+4px)] z-20 h-5 w-[23px] rounded-bl-lg border-b-2 border-l-2 border-solid border-[#f0f2f5] transition-all dark:border-[#3a3b3c] ${className}`}
            />
            {children}
        </div>
    )
}

export default CommentLine
