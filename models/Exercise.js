export default class Exercise {
    //@TODO add AI model attribute
    constructor(id, bodyGroupId, name, imageUrl) {
        this.id = id;
        this.bodyGroupId = bodyGroupId;
        this.name = name;
        this.image = imageUrl;
    }
}