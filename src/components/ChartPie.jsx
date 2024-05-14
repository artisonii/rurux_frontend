import React from 'react'

import { ArcElement, Chart, Legend, Title, Tooltip } from "chart.js";
import { Pie } from 'react-chartjs-2';
Chart.register(ArcElement, Tooltip, Legend, Title);

const ChartPie = ({ data }) => {
    const label = data?.map((elem) => {
        return elem.name;
    })

    const dataset = data?.map((elem) => {
        return elem.score;
    })

    const finaldata = {
        labels: label,
        datasets: [{
            label: "my subjects",
            data: dataset,
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                "rgba(75,192,192,1)",
                "#ecf0f1",
                "#50AF95",
                "#f3ba2f",
                "#2a71d0",
            ],
        }],
    }
    if (data?.length == 0) {
        return
    }
    return (
        <Pie data={finaldata} />
    )
}

export default ChartPie