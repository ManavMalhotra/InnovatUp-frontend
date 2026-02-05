import { motion } from 'motion/react';
import { siteConfig } from '../data/siteConfig';

/**
 * MentorshipSection - Currently minimal since mentors array is empty
 * Will be expanded when mentor data is provided
 */
export default function MentorshipSection() {
  // If no mentors, show a minimal placeholder
  if (siteConfig.mentors.length === 0) {
    return (
      <section
        id="mentors"
        className="relative py-16 bg-card/30"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12">
          <motion.p
            className="text-center text-sm text-muted-foreground"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Industry mentors · Coming soon
          </motion.p>
        </div>
      </section>
    );
  }

  // Full mentors section when data is available
  return (
    <section
      id="mentors"
      className="relative py-24 lg:py-32 bg-card/30"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12">
        <motion.div
          className="text-center mb-16"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="label-mono text-primary mb-4 block">Guidance</span>
          <h2 className="headline-lg font-display text-foreground">
            <span className="text-gradient">Mentors</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {siteConfig.mentors.map((mentor, index) => (
            <motion.div
              key={mentor.name}
              className="text-center glass-card-hover p-6"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-primary/10">
                <img
                  src={mentor.image}
                  alt={mentor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-display font-bold text-foreground mb-1">
                {mentor.name}
              </h3>
              <p className="body-text text-sm">{mentor.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
