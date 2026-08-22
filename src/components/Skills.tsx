import { skillGroups } from "@/lib/data";

export default function Skills() {
  return (
    <div className="panel section" id="skills">
      <div className="section-label">tech stack</div>
      <div className="skill-groups">
        {skillGroups.map((group) => (
          <div className="skill-group" key={group.title}>
            <h3>{group.title}</h3>
            {group.items.map((item) => (
              <div className="skill-item" key={item.name}>
                <div className="row">
                  <span className="name">{item.name}</span>
                  <span className="lvl">{item.level}</span>
                </div>
                <div className="bar">
                  <div className="bar-fill" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
