class Tree {
    // nodes: Array of Node objects
    constructor(...nodes) {
        this.__links = this.__generate_links(nodes)
        this.nodes = this.__linkify(nodes)
    }

    __generate_links(nodes) {
        var links = {}
        nodes.forEach(node => {
            links[node.name] = node
            node.aliases.forEach(alias => {
                links[alias] = node
            })
        })
        return links
    }
    
    __linkify(nodes) {
        return nodes.map(node => {
            node.linkify(this.__links)
            return node
        })
    }

    draw_objects() {
        // Finding the gen 1 nodes
        let offset = 0
        this.nodes.forEach(node => {
            if (!node.has_parents && !node.spouse_is_loaded()) {
                node.loaded = true
                let units_req = node.units_required()
                node.units = units_req/2
                node.offset = offset
                offset += units_req
                node.position_children()
            }
            console.log(node)
        })
        return this.nodes.map(node => {
            return node.get_draw_object()
        })
    }
}