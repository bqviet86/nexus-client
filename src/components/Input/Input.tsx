function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={
                'h-10 w-full rounded-lg border border-solid border-[#ddd] bg-white px-2 py-1 text-[14px] transition-all hover:border-[#007bff] focus:border-[#007bff] lg:h-11 lg:px-3 lg:py-2 lg:text-base dark:border-white/70 dark:bg-[#242526]/70 dark:text-white/70 dark:hover:border-[#9b7cee] dark:focus:border-[#9b7cee]' +
                (props.className ? ` ${props.className}` : '')
            }
        />
    )
}

export default Input
