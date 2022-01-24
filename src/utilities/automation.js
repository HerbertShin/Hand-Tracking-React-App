// Convert coordinates to vectors 
export function convertToVector(coordinates, camRes1, camRes2) {
    //Landmark 0 --> Landmark 4
    const vectors1 = [];
    //Landmark 0 --> Landmark 8
    const vectors2 = [];
    //Landmark 0 --> Landmark 12
    const vectors3 = [];
    //Landmark 0 --> Landmark 16
    const vectors4 = [];
    //Landmark 0 --> Landmark 20
    const vectors5 = [];
    //Each set of vectors 
    const allVectors = [];
    //camRes1 => x,z camRes2 => y 
    //Split hand coordinates into 5 arrays (sections)
    //Section 1 - has 4 vectors 
    for (let i = 1; i < 5; i++) {
        const x1 = coordinates[i][0] * camRes1;
        const y1 = coordinates[i][1] * camRes2;
        const z1 = coordinates[i][2] * camRes1;
        const x2 = coordinates[i + 1][0] * camRes1;
        const y2 = coordinates[i + 1][1] * camRes2;
        const z2 = coordinates[i + 1][2] * camRes1;
        let vx = (x2 - x1);
        let vy = (y2 - y1);
        let vz = (z2 - z1);
        vx = parseFloat(vx)
        vy = parseFloat(vy)
        vz = parseFloat(vz)
        vectors1.push([parseFloat(vx), parseFloat(vy), parseFloat(vz)]);
    }

    //Section 2
    for (let j = 1; j < 5; j++) {
        //initially add 4 after first increment 
        if (j == 1) {
            let vx = ((coordinates[j + 5][0] * camRes1) - (coordinates[j][0] * camRes1));
            let vy = ((coordinates[j + 5][1] * camRes2) - (coordinates[j][1] * camRes2));
            let vz = ((coordinates[j + 5][2] * camRes1) - (coordinates[j][2] * camRes1));
            vx = parseFloat(vx)
            vy = parseFloat(vy)
            vz = parseFloat(vz)
            vectors2.push([parseFloat(vx), parseFloat(vy), parseFloat(vz)]);
        }
        else {
            const x1 = coordinates[j + 4][0] * camRes1;
            const y1 = coordinates[j + 4][1] * camRes2;
            const z1 = coordinates[j + 4][2] * camRes1;
            const x2 = coordinates[j + 5][0] * camRes1;
            const y2 = coordinates[j + 5][1] * camRes2;
            const z2 = coordinates[j + 5][2] * camRes1;
            let vx = (x2 - x1);
            let vy = (y2 - y1);
            let vz = (z2 - z1);
            vx = parseFloat(vx)
            vy = parseFloat(vy)
            vz = parseFloat(vz)
            vectors2.push([parseFloat(vx), parseFloat(vy), parseFloat(vz)]);
        }
    }

    //Section 3
    for (let k = 1; k < 5; k++) {
        //initially add 4 after first increment 
        if (k == 1) {
            let vx = ((coordinates[k + 9][0] * camRes1) - (coordinates[k][0] * camRes1));
            let vy = ((coordinates[k + 9][1] * camRes2) - (coordinates[k][1] * camRes2));
            let vz = ((coordinates[k + 9][2] * camRes1) - (coordinates[k][2] * camRes1));
            vx = parseFloat(vx)
            vy = parseFloat(vy)
            vz = parseFloat(vz)
            vectors3.push([parseFloat(vx), parseFloat(vy), parseFloat(vz)]);
        }
        else {
            const x1 = coordinates[k + 8][0] * camRes1;
            const y1 = coordinates[k + 8][1] * camRes2;
            const z1 = coordinates[k + 8][2] * camRes1;
            const x2 = coordinates[k + 9][0] * camRes1;
            const y2 = coordinates[k + 9][1] * camRes2;
            const z2 = coordinates[k + 9][2] * camRes1;
            //1. 10, 1  2. 11, 10 3. 12, 11 4. 13, 12
            let vx = (x2 - x1);
            let vy = (y2 - y1);
            let vz = (z2 - z1);
            vx = parseFloat(vx)
            vy = parseFloat(vy)
            vz = parseFloat(vz)
            vectors3.push([parseFloat(vx), parseFloat(vy), parseFloat(vz)]);
        }
    }

    //Section 4
    for (let u = 1; u < 5; u++) {
        //initially add 4 after first increment 
        if (u == 1) {
            let vx = ((coordinates[u + 13][0] * camRes1) - (coordinates[u][0] * camRes1));
            let vy = ((coordinates[u + 13][1] * camRes2) - (coordinates[u][1] * camRes2));
            let vz = ((coordinates[u + 13][2] * camRes1) - (coordinates[u][2] * camRes1));
            vx = parseFloat(vx)
            vy = parseFloat(vy)
            vz = parseFloat(vz)
            vectors4.push([parseFloat(vx), parseFloat(vy), parseFloat(vz)]);
        }
        else {
            const x1 = coordinates[u + 12][0] * camRes1;
            const y1 = coordinates[u + 12][1] * camRes2;
            const z1 = coordinates[u + 12][2] * camRes1;
            const x2 = coordinates[u + 13][0] * camRes1;
            const y2 = coordinates[u + 13][1] * camRes2;
            const z2 = coordinates[u + 13][2] * camRes1;
            //1.  14, 1   2. 15, 14   3. 16, 15   4. 17, 16
            let vx = (x2 - x1);
            let vy = (y2 - y1);
            let vz = (z2 - z1);

            vectors4.push([parseFloat(vx), parseFloat(vy), parseFloat(vz)]);
        }
    }

    //Section 5
    for (let v = 1; v < 5; v++) {
        //initially add 4 after first increment 
        if (v == 1) {
            let vx = ((coordinates[v + 17][0] * camRes1) - (coordinates[v][0] * camRes1));
            let vy = ((coordinates[v + 17][1] * camRes2) - (coordinates[v][1] * camRes2));
            let vz = ((coordinates[v + 17][2] * camRes1) - (coordinates[v][2] * camRes1));

            vectors5.push([parseFloat(vx), parseFloat(vy), parseFloat(vz)]);
        }
        else {
            const x1 = coordinates[v + 16][0] * camRes1;
            const y1 = coordinates[v + 16][1] * camRes2;
            const z1 = coordinates[v + 16][2] * camRes1;
            const x2 = coordinates[v + 17][0] * camRes1;
            const y2 = coordinates[v + 17][1] * camRes2;
            const z2 = coordinates[v + 17][2] * camRes1;
            let vx = (x2 - x1);
            let vy = (y2 - y1);
            let vz = (z2 - z1);

            vectors5.push([parseFloat(vx), parseFloat(vy), parseFloat(vz)]);
        }
    }

    allVectors.push(vectors1, vectors2, vectors3, vectors4, vectors5);
    return allVectors;
}

// Calculate magnitude 
export const calculateMagnitude = (vectors) => {
    // Array to output magnitudes 
    const magnitudes = [];
    // Create seperate arrays for each set of vectors on a finger 
    for (let i = 0; i < vectors.length; i++) {
        const magnitudeSet = [];
        for (let j = 0; j < vectors.length - 1; j++) {
            let x = vectors[i][j][0];
            let y = vectors[i][j][1];
            let z = vectors[i][j][2];
            let absVal = abs(x, y, z);
            parseFloat(absVal);
            magnitudeSet.push(absVal);
        }
        magnitudes.push(magnitudeSet);
    }
    // Return all magnitudes 
    return magnitudes;
}

// Calculate angle  
export const calculateAngle = (vectors, magnitudes, time) => {
    const angles = [time];

    //theta = arccos((v1 dot v2)/(|v1||v2|))
    for (let set = 0; set < 5; set++) {
        angles.push(angle(vectors[set][0], vectors[set][1], magnitudes[set][0], magnitudes[set][1]));
        angles.push(angle(vectors[set][1], vectors[set][2], magnitudes[set][1], magnitudes[set][2]));
        angles.push(angle(vectors[set][2], vectors[set][3], magnitudes[set][2], magnitudes[set][3]));
    }
    return angles;
}

// Calculate angle of each set of landmarks 
export const angle = (vectorOne, vectorTwo, magnitudeOne, magnitudeTwo) => {
    // Calculate dot product of two vectors 
    let dotProductResult = dotProduct(vectorOne, vectorTwo);
    // Inner calculation before arc cosine 
    let innerCalculation = dotProductResult / (magnitudeOne * magnitudeTwo);
    // Arc cosine calculation to get angle 
    let angleResult = Math.acos(innerCalculation);
    // Convert into degrees from radians 
    angleResult = parseFloat(angleResult) * (180 / Math.PI);
    // Limit to two significant digits 
    angleResult = parseFloat(angleResult.toFixed(1));
    // Return angle results 
    return angleResult;
}

// Dot product 
export const dotProduct = (v1, v2) => {
    // Dot product of two vectors 
    let result = (v1[0] * v2[0]) + (v1[1] * v2[1]) + (v1[2] * v2[2]);
    // Return dot product 
    return result;
}

// Calculate absolute value 
export const abs = (x, y, z) => {
    // Square and sum all values 
    const squareSum = Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2);
    // Square root the squared sums 
    const absolute = Math.sqrt(squareSum);
    // Return absolute value 
    return absolute;
}

// Count number of data sets 
export const countData = (array) => {
    const size = array.length;
    return size;
};

