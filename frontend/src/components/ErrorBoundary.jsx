import React from 'react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error('Unhandled render error:', error, info);
    }

    render() {
        if (!this.state.hasError) return this.props.children;

        return (
            <div className="min-h-[60vh] flex items-center justify-center px-6">
                <div className="text-center max-w-md">
                    <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-4">
                        Transmission Interrupted
                    </p>
                    <h1 className="text-3xl font-black tracking-tighter mb-3">
                        SYSTEM FAULT
                    </h1>
                    <p className="text-zinc-400 text-sm mb-8">
                        Something went wrong while rendering this page. Reloading usually fixes it.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-white text-[#0A0A0A] font-mono text-[12px] font-medium px-6 py-3 uppercase tracking-[0.15em] hover:bg-[#8b1919] hover:text-white transition-all duration-300"
                    >
                        Reload Page
                    </button>
                </div>
            </div>
        );
    }
}
