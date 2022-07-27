import * as d3 from "https://cdn.skypack.dev/d3@7"

const renderTitle = () => {
    const h1 = document.createElement('h1')
    h1.textContent = 'Doping in Professional Bicycle Racing'
    h1.setAttribute('id', 'title')
    document.body.append(h1)

    const h2 = document.createElement('h2')
    h2.textContent = "35 Fastest times up Alpe d'Huez"
    h2.setAttribute('id', 'subtitle')
    document.body.append(h2)
}



const data = async () => {
    const response = await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
    const data = await response.json()
    return data
}

const createSVG = (data) => {

    const h = 800
    const w = 1500
    const padding = 100
    
    const body = d3.select('body')

    body.append('svg')
        .attr('height', h)
        .attr('width', w)
    
    const parseYear = d3.timeParse('%Y')
    const parseTime = d3.timeParse('%M:%S')

    const xExtent = d3.extent(data, d => parseYear(d.Year))
    const xRange = xExtent[1] - xExtent[0]

    const xScale = d3.scaleTime()
        .domain([new Date(xExtent[0] - (xRange * .05)), new Date(xExtent[1] + (xRange * .05))])
        .range([padding, w - padding])
        .nice()

    const yScale = d3.scaleTime()
        .domain(d3.extent(data, d => parseTime(d.Time)))
        .range([padding, h - padding])
        .nice()


    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'))

    const svg = d3.select('svg')

    svg.append('g')
        .attr('id', 'x-axis')
        .attr('class', 'tick')
        .attr('transform', `translate(0, ${h - padding})`)
        .call(xAxis)
    svg.append('g')
        .attr('id', 'y-axis')
        .attr('class', 'tick')
        .attr('transform', `translate(${padding}, 0)`)
        .call(yAxis)

    const circleRadius = 10

    svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', d => xScale(parseYear(d.Year)))
        .attr('cy', d => yScale(parseTime(d.Time)))
        .attr('r', circleRadius)
        .attr('fill', d => d.Doping ? 'blue' : 'green')
        .attr('data-xvalue', d => parseYear(d.Year))
        .attr('data-yvalue', d => parseTime(d.Time))
        .on('mouseover', (e, d) => {
            
            if (!document.getElementById('tooltip')) {
            const divTop = e.pageY
            const divLeft = e.pageX

            const tooltip = body.append('div')
                    .attr('id', 'tooltip')
                    .attr('class', 'tooltip')
                    .attr('data-year', e.target.getAttribute('data-xvalue'))
                    .style('position', 'absolute')
                    .style('top', divTop + 'px')
                    .style('left', divLeft + 'px')
            tooltip.append('p')
                    .text(`${d.Name}: ${d.Nationality}`)
            tooltip.append('p')
                    .text(`Year: ${d.Year}, Time: ${d.Time}`)
            if (d.Doping) {
                tooltip.append('br')
                tooltip.append('p')
                    .text(d.Doping)
            }
            }
        })
        .on('mouseout', () => document.getElementById('tooltip').remove())
    
        const legend = svg.append('g')
            .attr('id', 'legend')
            .attr('transform', `translate(${w - 400}, 300)`)

        legend.append('text')
            .attr('text-anchor', 'end')
            .append('tspan')
                .attr('x', 255)
                .attr('dy', '2em')
                .text('Riders with doping allegations:')
            .append('tspan')
                .attr('x', 255)
                .attr('dy', '2em')
                .text('No doping allegations:')
        legend.append('rect')
            .attr('x', 260)
            .attr('y', '1em')
            .attr('height', 20)
            .attr('width', 20)
            .attr('fill', 'blue')
        legend.append('rect')
            .attr('x', 260)
            .attr('y', '3em')
            .attr('height', 20)
            .attr('width', 20)
            .attr('fill', 'green')

    }
const fetchAndRenderSVG = async () => {
    renderTitle()
    const bikeData = await data()
    createSVG(bikeData)
}

fetchAndRenderSVG()