class Tree {
    // nodes: Array of Node objects
    constructor(nodes) {
        this.__links = this.__generate_links(nodes)
        this.nodes = this.__linkify(nodes)
    }

    __generate_links(nodes) {
        links = {}
        nodes.forEach(node => {
            links[node.name] = node
            node.aliases.forEach(alias => {
                links[alias] = node
            })
        })
        return links
    }
    
    __linkify(nodes) {
        nodes.map(node => {
            node.linkify(this.__links)
            return node
        })
    }
}