function AppMessage({ tipo, texto }) {
    return (
        <div className={`app-message ${tipo}`}>
            {texto}
        </div>
    );
}

export default AppMessage;