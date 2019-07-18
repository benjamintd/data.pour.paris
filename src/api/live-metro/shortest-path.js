// TODO rewrite in Typescript, now natively supported by @now/node I think

module.exports = function(graph, idrefligc, start, end) {
  // explored contains the list of nodes that have been visited
  const explored = new Set();
  // open is a array of [stop, path].
  var open = [[start, []]];
  while (open.length > 0) {
    for (var i = 0, l = open.length; i < l; i++) {
      let s = open.shift();
      let stop = s[0];
      let path = s[1];
      // get the possible edges from that line (idrefligc) that begin at `stop`.
      let next = graph[idrefligc][stop] || [];
      // explore all those edges and add them to the open roads.
      for (var j = 0; j < next.length; j++) {
        let { lines, nextStop } = next[j];
        if (!explored.has(nextStop)) {
          let nextPath = path.concat(lines);
          if (nextStop == end) return nextPath;
          open.push([nextStop, nextPath]);
        }
      }
      explored.add(stop);
    }
  }
  // if we exit here there's no possible path between start and end
};
