import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function Grafico({ data }) {
    return (
        <div style={{ width: "100%", height: "300px", textAlign: "center", padding: "20px" }}>
            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="valor" stroke="#007bff" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default Grafico;
