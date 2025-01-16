export default function SignLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section className="container mx-auto">
            <div className="">
                {children}
            </div>
        </section>
    );
}
