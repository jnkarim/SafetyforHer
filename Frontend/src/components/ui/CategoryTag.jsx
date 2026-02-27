const COLORS = {
  Catfishing:  'bg-cyan/10 text-cyan',
  Stalking:    'bg-pink/10 text-pink',
  Gaming:      'bg-violet/10 text-violet',
  Privacy:     'bg-emerald/10 text-emerald',
  ImageAbuse:  'bg-rose/10 text-rose',
  Grooming:    'bg-amber/10 text-amber',
  Harassment:  'bg-orange-400/10 text-orange-400',
  Tips:        'bg-indigo-400/10 text-indigo-400',
}

const CategoryTag = ({ category }) => (
  <span className={`tag ${COLORS[category] ?? 'bg-white/10 text-muted'}`}>
    {category}
  </span>
)

export default CategoryTag