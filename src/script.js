let movieURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json';

let movieData;

let canvas = d3.select("#canvas");
let tooltip = d3.select("#tooltip");

const drawTreeMap = () => {
 
  // What are the components of drawing up a tree map? Tell D3 about the hirarchy in the data and they are stored in the "children".
  
  let hierarchy = d3.hierarchy(movieData, (node) => {
    return node['children'];
  }).sum((node)=> {
    return node['value'];
  }).sort((node1, node2) =>{
    return node2['value'] - node1['value'];
  })
  
 //Next step is to use d3.treemap() method on the hierarchy data values to draw coordinates on the canvas svg
  
  let createTreeMap = d3.treemap()
                          .size([1000, 600]);
  
  // then call createTreemap function on the variable hierarchy here:
  
  createTreeMap(hierarchy);
  
 // The leaves method looks at the individual items of the hierarchy like the "leaves" on a tree. Consoling these leaves to log we can now see the coordinates of each data item on which we can draw our Tree Map on the svg canvass:
  let movieTiles = hierarchy.leaves();
  console.log(movieTiles);
  
  let block = canvas.selectAll('g')
              .data(movieTiles)
              .enter()
              .append('g')
              .attr('transform', (movie)=>{
                return `translate(${movie['x0']}, ${movie['y0']})`
              })
  
  block.append('rect')
        .attr('class', 'tile')
        .attr('fill', (movie) => {
          let category = movie['data']['category'];
          switch (category) {
            case 'Action':
              return 'orange';
              break;
             case 'Drama':
              return 'lightgreen';
              break;
             case 'Adventure':
              return 'coral';
              break;
             case 'Family':
              return 'lightblue';
              break;
             case 'Animation':
              return 'pink';
              break;
             case 'Comedy':
              return 'khaki';
              break;
             case 'Biography':
              return 'tan';
              break;
          }
         }).attr('data-name', (movie)=> {
          return movie['data']['name'];
        }).attr('data-category', (movie)=>{
          return movie['data']['category'];
        }).attr('data-value', (movie) =>{
          return movie['data']['value'];
        })
        .attr('width', (movie)=> {
          return movie['x1'] - movie['x0'];
        })
         .attr('height', (movie)=> {
          return movie['y1'] - movie['y0'];
  })
  .on('mouseover', (movie, i)=> {
    console.log(i)
    tooltip.transition().style('visibility', 'visible')
   
    let revenue = i['data']['value'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    tooltip.html('Revenue: $ ' + revenue + '<hr />' + i['data']['name']);
    tooltip.attr('data-value', i['data']['value'])
    
  })
  .on('mouseout', (movie)=> {
    tooltip.transition()
      .style('visibility', 'hidden')
  })
  
  block.append('text')
        .text((movie) => {
            return movie['data']['name'];
        })
        .attr('x', 5)
        .attr('y', 20)
   
  
  
}


// fetching movie tree map data

d3.json(movieURL).then((data, error) => {
  if (error) {
    console.log(error);
  } else {
    movieData = data;
    drawTreeMap();
  }
})