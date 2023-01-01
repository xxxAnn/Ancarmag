class Node {
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
        this.__generate_relations()
    }

    linkify(links) {
        this.__parents = this.__parents.map(parent => { return links[parent] })
        this.__siblings = this.__siblingss.map(parent => { return links[parent] })
        this.__children = this.__children.map(parent => { return links[parent] })
        this.__spouse = links[this.__spouse]
        this._linkified = true
    }

    __generate_relations() {
        this.__parents = []
        this.__children = []
        this.__siblings = []
        this.__raw_relations.forEach(full_relation => {
            [relation, character_name] = full_relation.replace(" ", "").split(":")
            relation_type = Node.__get_relation_type_as_int(relation) 
            if (relation_type == 1) { this.__parents.push(character_name) }
            else if (relation_type == 2) { this.__spouse = character_name } 
            else if (relation_type == 3) { this.__children = character_name } 
            else if (relation_type == 4) { this.__siblings = character_name } 
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
        if (this.__relation_matrix.contains(relation)) { return this.__relation_matrix[relation] } 
        else { return 0 }
    }
}

function relations_from_string(relations) {
    relations.replace(" ", "").split(";")
}


