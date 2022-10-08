const YEAR = new Date().getFullYear()

export default {
  footer: (
    <footer>
      <small>
        <time>{YEAR}</time> © Allen Liu.
        <a href="https://cdn.guff.com/site_2/media/33000/32700/items/09a7d96cd18b3d2cae9fa2fc.jpg">bonk</a>
      </small>
      <style jsx>{`
        footer {
          margin-top: 8rem;
        }
        a {
          float: right;
        }
      `}</style>
    </footer>
  ),
}
