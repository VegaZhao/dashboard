import env from './env'

const DEV_URL = 'http://10.1.89.150:8082/'
const PRO_URL = 'http://localhost:8082/' // 'https://produce.com'

export default env === 'production' ? DEV_URL : PRO_URL
