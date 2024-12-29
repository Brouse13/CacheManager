let stats = {
    l1: {
        hit: 0,
        miss: 0,
        penalty: 10
    },
    l2: {
        hit: 0,
        miss: 0,
        penalty: 10
    },
    l3: {
        hit: 0,
        miss: 0,
        penalty: 10
    },
    cpi: 1
}

/**
 * Update the cache stats for the given {@param cache}
 *
 * @param cache Cache name {l1, l2, l3}
 * @param type Miss or Hit {hit = true, miss = false, undefined = no-update}
 */
function calculateStat(cache, type) {
    let stat = stats[cache]

    // Update the hit/miss
    if (type !== undefined) {
        if (type) stat.hit++;
        else stat.miss++;
    }

    // Avoid division per 0
    let divisor = stat.hit + stat.miss;
    let percentage = divisor === 0 ? 0 : stat.miss / divisor;

    // Calculate the percentage and return the cpi
    return {cpi: stats.cpi + percentage * stat.penalty, range: 1 - percentage}
}

function updateCacheStats(index, type) {
    let cache = cacheMap[index] || 'l1';
    let cpi = calculateStat(cache, type)
    renderStats(cache, { hit: stats[cache].hit, miss: stats[cache].miss, cpi: cpi });
}

/**
 * Render the stats for the given {@param cache}
 *
 * @param cache Cache name {l1, l2, l3}
 * @param data Data to render
 */
function renderStats(cache, data) {
    $(`#hit-${cache}`).text(data.hit);
    $(`#miss-${cache}`).text(data.miss);
    $(`#cpi-${cache}`).text(Number(Math.round(data.cpi.cpi + 'e2') + 'e-2'));
    $(`#ratio-${cache}`).text(Math.round(data.cpi.range * 100) + '%');
}