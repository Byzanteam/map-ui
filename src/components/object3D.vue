<script>
import MapMixin from '../mixins/map';

export const Object3D = {
  mixins: [MapMixin],

  props: {
    // 模型路径
    modelSourcePath: {
      type: Array,
      default: [],
    },
    // 光照配置
    lightOption: {
      type: Object,
      default: () => ({
        ambientLight: [[1, 1, 1], 1],
        directionLight: [[1, 0, -0.5], [1, 1, 1], 0.5],
      }),
    },
    // 模型配置
    modelOption: {
      type: Array,
      default: () => ([{
        modelOption: {
          position: [104.069755, 30.61565],
          scale: 7.75,
          height: 10,
          scene: 0,
        },
      }]),
    },
  },

  data () {
    return {
      timer: null,
    };
  },

  watch: {
    map (value) {
      if (value && typeof AMapUI === 'undefined') {
        this.renderModel();
      }
    },
  },

  methods: {
    renderModel () {
      const _this = this;
      // 光线配置，即光照，打光
      this.map.AmbientLight = new AMap.Lights.AmbientLight(
        ...this.lightOption.ambientLight
      );
      this.map.DirectionLight = new AMap.Lights.DirectionLight(
        ...this.lightOption.directionLight
      );
      // 添加Object3DLayer图层，用来承载3D模型
      const object3Dlayer = new AMap.Object3DLayer();
      this.map.add(object3Dlayer);
      AMap.plugin(['AMap.GltfLoader'], () => {
        this.loadSource(object3Dlayer);
      });
      this.map.on('click', function readModelSource (ev) {
        const { pixel } = ev;
        const px = new AMap.Pixel(pixel.x, pixel.y);
        const obj = this.getObject3DByContainerPos(
          px, [object3Dlayer], false
        ) || {};

        // 1 选中的 face 所在的索引；
        // 2 object3D 对象，这里为当前 Mesh；
        // 3 被拾取到的对象和拾取射线的交叉点的3D坐标；
        // 4 交叉点距透视原点的距离
        const {
          index, object, point, distance,
        } = obj;
        _this.$emit('modelClick', index, object, point, distance);
      });
    },
    loadSource (object3Dlayer) {
      for (let i = 0; i < this.modelSourcePath.length; i += 1) {
        const gltf = new AMap.GltfLoader();
        // 调用load方法，加载 glTF 模型资源
        const model_source_path = this.modelSourcePath[i];
        const urlDuck = `/${model_source_path}`;
        gltf.load(urlDuck, (gltfModel) => {
          // gltfModel 为解析后的gltf对象
          // 开启模型透明开关
          this.$nextTick(() => {
            for (let a = 0; a < gltfModel.layerMesh.length; a += 1) {
              gltfModel.layerMesh[a].transparent = true;
            }
          });
          const {
            position, scale, height, scene,
          } = this.modelOption[i];
          gltfModel.setOption({
            position: new AMap.LngLat(position[0], position[1]),
            scale,
            height,
            scene,
          });
          gltfModel.rotateX(90);
          gltfModel.rotateZ(0);
          object3Dlayer.add(gltfModel);
        });
      }
    },
  },
};

export default Object3D;
</script>
