class CustomAggregate {
    constructor(model) {
        this.model = model;
        this.pipeline = [];
    }

    addRelation(relation) {
       this.pipeline.push({
          $lookup: {
            from: relation.collection, // Replace with the name of the owners collection
            localField: relation.localField,
            foreignField: relation.foreignField ?? '_id',
            as: relation.localField,
          },
        });

        if (relation.excludeFields && relation.excludeFields.length > 0) {
            const projectStage = {
                $project: {
                },
            };
            
            for (const field of relation.excludeFields) {
                projectStage.$project[`${relation.localField}.${field}`] = 0;
            }

            this.pipeline.push(projectStage);
        }
        
       this.pipeline.push({
          $unwind: '$' + relation.localField,
        });

        return this;
    }

    addMatch(match){    
        this.pipeline.push({
            $match: match
        })

        return this;
    }

    addOrMatches(list){
        this.pipeline.push({
            $match: {
                $or: this.makeMatchListArray(list)
            }
        })

        return this;
    }

    addAndMatches(list){
        this.pipeline.push({
            $match: {
                $and: this.makeMatchListArray(list)
            }
        })

        return this;
    }

    execute(){
        return this.model.aggregate(this.pipeline);
    }

    addSort(sort){
        this.pipeline.push({
            $sort: sort,
        });

        return this;
    }

    addPagination(pageNumber, pageSize){
        const skip = (pageNumber - 1) * pageSize;
        this.pipeline.push({
            $skip: skip,
        });
        this.pipeline.push({
            $limit: pageSize,
        });

        return this;
    }

    makeMatchListArray(list){
        let array = [];

        for (const [key, value] of Object.entries(list)) {
            const object = { [key]: value }; // Create an object with a single key-value pair
            array.push(object);
        }

        return array;
    }

    
    excludeFields(fieldsToExclude) {
        const projection = {};
        
        if (fieldsToExclude && fieldsToExclude.length > 0) {
            for (const field of fieldsToExclude) {
                projection[field] = 0; // Exclude the specified field
            }
        }

        this.pipeline.push({
            $project: projection,
        });

        return this;
    }

    includeFields(fieldsToInclude) {
        const projection = {};
        
        if (fieldsToInclude && fieldsToInclude.length > 0) {
            for (const field of fieldsToInclude) {
                projection[field] = 1; // Include the specified field
            }
        }

        this.pipeline.push({
            $project: projection,
        });

        return this;
    }
    
    addLimit(limit) {

        if(!limit) return this;

        if (typeof limit === 'number' && limit > 0) {
            this.pipeline.push({
                $limit: limit,
            });
        } else {
            throw new Error('Limit must be a positive number.');
        }

        return this;
    }
    
}

module.exports = CustomAggregate;