export const Logo = ({ className = "h-6 w-6", ...props }) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904L9 21l8.904-4.43m-10.97-6.52c.093-.207.234-.388.411-.53L15 4.5m-7.5 7.5L3 18v-4.5m12-9L16.5 3h3v3M15 4.5l3 3M15 4.5l3.75 3.75M9 13.5H3"
        />
    </svg>
);