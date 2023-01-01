class CharNode {
    // name: string
    // alias: string
    // relations: array of strisng
    constructor(name, aliases, relations, gender) {
        this.name = name
        this.aliases = aliases
        this.gender = gender // 0: F, 1: M, 2: X
        this.__raw_relations = relations
        this._linkified = false
        this._relations_loaded = false
        this.loaded = false
        this.units = 0
        this.row = 0
        this.offset = 0
        this.__generate_relations()
    }

    linkify(links) {
        this.__parents = this.__parents.map(parent => { return links[parent] })
        this.__siblings = this.__siblings.map(parent => { return links[parent] })
        this.__children = this.__children.map(parent => { return links[parent] })
        if (this.has_spouse) {
            this.__spouse = links[this.__spouse]
        }
        this._linkified = true
    }

    __generate_relations() {
        this.__parents = []
        this.__children = []
        this.__siblings = []
        this.__spouse = null
        this.__raw_relations.forEach(full_relation => {
            var [character_name, relation] = full_relation.replace(" ", "").split(":")
            var relation_type = CharNode.__get_relation_type_as_int(relation) 
            if (relation_type == 1) { this.__parents.push(character_name) }
            else if (relation_type == 2) { this.__spouse = character_name } 
            else if (relation_type == 3) { this.__children.push(character_name) } 
            else if (relation_type == 4) { this.__siblings.push(character_name) } 
        })
        this._relations_loaded = true
        this._linkified = false
    }

    get siblings() {
        if (!this._relations_loaded) { this.__generate_relations }
        if (this.__siblings.length == 0) { return null } 
        else { return this.__siblings }
    }

    get parents() {
        if (!this._relations_loaded) { this.__generate_relations }
        if (this.__parents.length == 0) { return null } 
        else { return this.__parents }
    }

    get children() {
        if (!this._relations_loaded) { this.__generate_relations }
        if (this.__children.length == 0) { return null } 
        else { return this.__children }
    }

    get spouse() {
        if (!this._relations_loaded) { this.__generate_relations }
        return this.__spouse
    }

    get has_parents() {
        return this.parents != null
    }

    get has_spouse() {
        return this.__spouse != null
    }

    spouse_is_loaded() {
        if (!this.has_spouse) {
            return false
        }
        this.__spouse.loaded
    }

    units_required() {
        if (!this._linkified) {
            return undefined
        }
        var units = 0
        this.__children.forEach(
            ch => { units += Math.max(ch.units_required(), 1) }
        )
        return Math.max(units, 1) + (this.has_spouse ? 1 : 0)
    }
 
    position_children() {
        var offset = this.offset
        this.__children.forEach(child => {
            child.row = this.row+1
            var units_required = child.units_required()
            child.units = units_required/2
            child.offset = offset
            offset += units_required
            child.loaded = true
            child.position_children()
        })
    }

    static __relation_matrix = {
        "parent": 1,
        "dad": 1,
        "father": 1,
        "mom": 1,
        "mother": 1,
        "spouse": 2,
        "husband": 2,
        "wife": 2,
        "daughter": 3,
        "son": 3,
        "child": 3,
        "kid": 3,
        "sibling": 4,
        "brother": 4,
        "sister": 4
    }
    
    // relation: string
    static __get_relation_type_as_int(relation) {
        console.log(relation)
        if (Object.keys(CharNode.__relation_matrix).includes(relation)) { return CharNode.__relation_matrix[relation] } 
        else { return 0 }
    }

    create_node(x, y, w, h) {
        return new DrawNode(x, y, w, h, this.name)
    }

    static UNIT_XLENGTH = 20
    static UNIT_YLENGTH = 10

    get_draw_object() {
        return this.create_node(this.offset * CharNode.UNIT_XLENGTH + 10 + this.units*10, this.row * 1.5 * CharNode.UNIT_YLENGTH + 10, this.units * CharNode.UNIT_XLENGTH, CharNode.UNIT_YLENGTH)
    }
}

function relations_from_string(relations) {
    relations.replace(" ", "").split(";")
}


