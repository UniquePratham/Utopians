export function Footer() {
    return (
        <footer className="py-8 text-center text-sm text-muted-foreground border-t border-white/10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <p>&copy; {new Date().getFullYear()} Utopians. All rights reserved.</p>
            <p className="mt-2">University of Calcutta</p>
        </footer>
    );
}
