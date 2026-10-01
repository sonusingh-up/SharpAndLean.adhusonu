import { giBand, glBand, glycaemicLoad, netCarbs, rankedFruits } from '@/lib/fruit-gi';
import { siteUrl } from '@/lib/config';
import { LinkPreview } from './notion-mention-link';
import s from './fruit-comparison.module.css';

/** One server-rendered table: rows become labelled cards when the reading
 * column is narrow, including beside the sidebar on small laptops. */
export function FruitComparison() {
  const ranked = rankedFruits();

  return (
    <div className={`${s.comparison} not-prose`} data-fruit-comparison>
      <div className={s.panel}>
        <div className={s.intro}>
          <div className={s.headingRow}>
            <span className={s.eyebrow}>The everyday fruit guide</span>
            <span className={s.count}>{ranked.length} fruits</span>
          </div>
          <h3 className={s.title}>Compare by serving</h3>
          <p className={s.description}>
            Lowest glycaemic load first. Fresh fruit: 120 g. Dried fruit: 30 g.
          </p>
          <div className={s.legend} aria-label="Glycaemic load key">
            <span className={s.legendLabel}>GL key</span>
            <span className={`${s.key} ${s.low}`}>Low ≤ 10</span>
            <span className={`${s.key} ${s.medium}`}>Medium 11–19</span>
            <span className={`${s.key} ${s.high}`}>High ≥ 20</span>
          </div>
        </div>

        <table className={s.table} role="table">
          <caption className={s.srOnly}>
            {ranked.length} fruits ranked by glycaemic load per serving, with glycaemic index and
            net carbohydrate. Values are approximate.
          </caption>
          <thead className={s.head} role="rowgroup">
            <tr role="row">
              <th className={s.column} scope="col" role="columnheader">
                Fruit &amp; serving
              </th>
              <th className={s.column} scope="col" role="columnheader">
                Glycaemic index <span>(GI)</span>
              </th>
              <th className={s.column} scope="col" role="columnheader">
                Net carbs <span>per serving</span>
              </th>
              <th className={s.column} scope="col" role="columnheader">
                Glycaemic load <span>(GL)</span>
              </th>
            </tr>
          </thead>
          <tbody className={s.rows} role="rowgroup">
            {ranked.map((fruit, index) => {
              const load = Math.round(glycaemicLoad(fruit));
              const loadBand = glBand(load);
              const indexBand = giBand(fruit.gi);
              return (
                <tr className={s.row} role="row" key={fruit.name}>
                  <th className={`${s.cell} ${s.fruit}`} scope="row" role="rowheader">
                    <div className={s.fruitHeading}>
                      <span className={s.rank} aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div>
                        {fruit.href ? (
                          <LinkPreview
                            className={s.fruitLink}
                            href={fruit.href}
                            previewUrl={new URL(fruit.href, siteUrl).href}
                          >
                            {fruit.name}
                          </LinkPreview>
                        ) : (
                          <span className={s.fruitName}>{fruit.name}</span>
                        )}
                        <span className={s.serving}>
                          {fruit.servingG} g · {fruit.group === 'dried' ? 'Dried' : 'Fresh'}
                        </span>
                      </div>
                    </div>
                  </th>
                  <td className={`${s.cell} ${s.index}`} role="cell">
                    <span className={s.mobileLabel} aria-hidden="true">
                      Glycaemic index
                    </span>
                    <span className={s.metric}>
                      {fruit.approximate && <span className={s.approximate}>About </span>}
                      {fruit.gi}
                      <span className={`${s.indexBand} ${s[indexBand]}`}>{indexBand}</span>
                    </span>
                  </td>
                  <td className={`${s.cell} ${s.carbs}`} role="cell">
                    <span className={s.mobileLabel} aria-hidden="true">
                      Net carbs
                    </span>
                    <span className={s.metric}>
                      {Math.round(netCarbs(fruit))}
                      <span className={s.unit}> g</span>
                    </span>
                  </td>
                  <td className={`${s.cell} ${s.load}`} role="cell">
                    <span className={s.mobileLabel} aria-hidden="true">
                      Glycaemic load
                    </span>
                    <span className={s.loadValue}>
                      <span className={s.loadNumber}>{load}</span>
                      <span className={`${s.badge} ${s[loadBand]}`}>{loadBand}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <p className={s.footnote}>
          <strong>Portion size matters.</strong> These are average values. Variety, ripeness and the
          amount you eat can change the numbers.
        </p>
      </div>
    </div>
  );
}
