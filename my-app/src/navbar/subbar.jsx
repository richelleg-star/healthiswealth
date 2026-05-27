const styles = {
    toggleBtn: (isActive) => ({
        background: isActive ? 'var(--primary)' : 'transparent',
        color: isActive ? 'white' : 'var(--text-muted)',
        border: 'none',
        borderRadius: '6px',
        padding: '0.4rem 1rem',
        fontFamily: 'inherit',
        fontWeight: '500',
        fontSize: '0.9rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
    }),
    toggleGroup: {
        display: 'flex',
        gap: '0.25rem',
        background: 'var(--bg-color)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '0.25rem',
    },
    subBar: {
        display: 'flex',
        alignItems: 'center',
        padding: '0.5rem 1.5rem',
        borderBottom: '1px solid var(--border)',
    },
};

export function SubBar({ view, onViewChange, tabs }) {
    return (
        <div style={styles.subBar}>
            <div style={styles.toggleGroup}>
                {tabs.map(({ label, value }) => (
                    <button
                        key={value}
                        style={styles.toggleBtn(view === value)}
                        onClick={() => onViewChange(value)}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
}