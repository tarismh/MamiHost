const ClientError = require("../exception/clientError");
const {
    resSuccessHandler,
    resErrorHandler,
} = require("../exception/resHandler");
const { HostedService, User } = require("../models");
// const bcrypt = require("bcrypt");
// const http = require("node:http");
// const https = require("https");
const axios = require("axios");
require("dotenv").config();

const createService = async (req, res) => {
    try {
        const {
            user_email,
            duration,
            service_type,
            service_image,
            git_repository,
            db_dialect,
        } = req.body;
        const validateUser = await User.findOne({
            where: {
                email: req.body.user_email,
            },
        });
        if (!validateUser) {
            throw new ClientError(
                "Daftarkan Email Terlebih Dahulu Email Anda Pada Aplikasi Kami"
            );
        } else {
            const randomizedName = validateUser.username + "-" + makeName(6);
            let date = new Date();
            let selesai = new Date();
            if (req.body.service_type === "DB") {
                const createDBResource = async () => {
                    const pvcName = "pvc" + "-" + randomizedName;
                    const pvName = "pv" + "-" + randomizedName;
                    const podName = "db" + "-" + randomizedName;
                    const svcName = "svc" + "-" + randomizedName;
                    try {
                        // Claim PVC and PV Storage in Kubernetes
                        const makePV = async () => {
                            const pvClaim = JSON.stringify({
                                kind: "PersistentVolume",
                                apiVersion: "v1",
                                metadata: {
                                    name: pvName,
                                    labels: {
                                        type: "local",
                                        userapp: validateUser.username,
                                        "svc-type": "database",
                                    },
                                },
                                spec: {
                                    storageClassName: "manual",
                                    capacity: {
                                        storage: "500Mi",
                                    },
                                    accessModes: ["ReadWriteMany"],
                                    hostPath: {
                                        path: "/mnt/data",
                                    },
                                },
                            });

                            const pvAxiosConfig = {
                                method: "post",
                                url:
                                    process.env.KUBE_LINK +
                                    "/persistentvolumes",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${process.env.KUBE_TOKEN}`,
                                },
                                data: pvClaim,
                            };
                            return await axios(pvAxiosConfig);
                        };
                        await makePV();

                        const makePVC = async () => {
                            const pvcClaim = JSON.stringify({
                                kind: "PersistentVolumeClaim",
                                apiVersion: "v1",
                                metadata: {
                                    name: pvcName,
                                    labels: {
                                        userapp: validateUser.username,
                                        "svc-type": "database",
                                    },
                                },
                                spec: {
                                    storageClassName: "manual",
                                    accessModes: ["ReadWriteMany"],
                                    resources: {
                                        requests: {
                                            storage: "500Mi",
                                        },
                                    },
                                },
                            });

                            const pvcAxiosConfig = {
                                method: "post",
                                url:
                                    process.env.KUBE_LINK +
                                    "/namespaces/default/persistentvolumeclaims",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${process.env.KUBE_TOKEN}`,
                                },
                                data: pvcClaim,
                            };
                            return await axios(pvcAxiosConfig);
                        };
                        await makePVC();

                        // Condition based on what the dialect of the DB
                        if (req.body.db_dialect == "postgres") {
                            const makePod = async () => {
                                const dbPod = JSON.stringify({
                                    apiVersion: "v1",
                                    kind: "Pod",
                                    metadata: {
                                        name: podName,
                                        labels: {
                                            userapp: validateUser.username,
                                            "svc-type": "database",
                                        },
                                    },
                                    spec: {
                                        volumes: [
                                            {
                                                name: "db-pv-storage",
                                                persistentVolumeClaim: {
                                                    claimName: pvcName,
                                                },
                                            },
                                        ],
                                        containers: [
                                            {
                                                name: "postgres",
                                                image: "postgres",
                                                ports: [
                                                    {
                                                        containerPort: 5432,
                                                    },
                                                ],
                                                envFrom: [
                                                    {
                                                        configMapRef: {
                                                            name: "user-db-config",
                                                        },
                                                    },
                                                ],
                                                imagePullPolicy: "IfNotPresent",
                                                volumeMounts: [
                                                    {
                                                        mountPath:
                                                            "/var/lib/postgres/data",
                                                        name: "db-pv-storage",
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                });
                                const podAxiosConfig = {
                                    method: "post",
                                    url:
                                        process.env.KUBE_LINK +
                                        "/namespaces/default/pods",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${process.env.KUBE_TOKEN}`,
                                    },
                                    data: dbPod,
                                };
                                return await axios(podAxiosConfig);
                            };
                            await makePod();

                            const makeService = async () => {
                                const dbSvc = JSON.stringify({
                                    apiVersion: "v1",
                                    kind: "Service",
                                    metadata: {
                                        name: svcName,
                                        labels: {
                                            userapp: validateUser.username,
                                            "svc-type": "database",
                                        },
                                    },
                                    spec: {
                                        ports: [
                                            {
                                                port: 5432,
                                                targetPort: 5432,
                                            },
                                        ],
                                        selector: {
                                            userapp: validateUser.username,
                                        },
                                        type: "NodePort",
                                    },
                                });
                                const svcAxiosConfig = {
                                    method: "post",
                                    url:
                                        process.env.KUBE_LINK +
                                        "/namespaces/default/services",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${process.env.KUBE_TOKEN}`,
                                    },
                                    data: dbSvc,
                                };
                                return await axios(svcAxiosConfig);
                            };
                            await makeService();
                        } else if (req.body.db_dialect == "mysql") {
                            const makePod = async () => {
                                const dbPod = JSON.stringify({
                                    apiVersion: "v1",
                                    kind: "Pod",
                                    metadata: {
                                        name: podName,
                                        labels: {
                                            userapp: validateUser.username,
                                            "svc-type": "database",
                                        },
                                    },
                                    spec: {
                                        volumes: [
                                            {
                                                name: "db-pv-storage",
                                                persistentVolumeClaim: {
                                                    claimName: pvcName,
                                                },
                                            },
                                        ],
                                        containers: [
                                            {
                                                name: "mysql",
                                                image: "mysql:5.6",
                                                ports: [
                                                    {
                                                        containerPort: 3306,
                                                    },
                                                ],
                                                envFrom: [
                                                    {
                                                        configMapRef: {
                                                            name: "user-db-config",
                                                        },
                                                    },
                                                ],
                                                imagePullPolicy: "IfNotPresent",
                                                volumeMounts: [
                                                    {
                                                        mountPath:
                                                            "/var/lib/mysql",
                                                        name: "db-pv-storage",
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                });
                                const podAxiosConfig = {
                                    method: "post",
                                    url:
                                        process.env.KUBE_LINK +
                                        "/namespaces/default/pods",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${process.env.KUBE_TOKEN}`,
                                    },
                                    data: dbPod,
                                };
                                return await axios(podAxiosConfig);
                            };
                            await makePod();

                            const makeService = async () => {
                                const dbSvc = JSON.stringify({
                                    apiVersion: "v1",
                                    kind: "Service",
                                    metadata: {
                                        name: svcName,
                                        labels: {
                                            userapp: validateUser.username,
                                            "svc-type": "database",
                                        },
                                    },
                                    spec: {
                                        ports: [
                                            {
                                                port: 3306,
                                                targetPort: 3306,
                                            },
                                        ],
                                        selector: {
                                            userapp: validateUser.username,
                                        },
                                        type: "NodePort",
                                    },
                                });

                                const svcAxiosConfig = {
                                    method: "post",
                                    url:
                                        process.env.KUBE_LINK +
                                        "/namespaces/default/services",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${process.env.KUBE_TOKEN}`,
                                    },
                                    data: dbSvc,
                                };
                                return await axios(svcAxiosConfig);
                            };
                            await makeService();
                        }

                        return {
                            status: "success",
                            podName: podName,
                        };
                    } catch (err) {
                        return err;
                    }
                };

                const buildImage = await createDBResource();
                console.log(buildImage);
                if (buildImage.status == "success") {
                    selesai.setDate(date.getDate() + req.body.duration);
                    const insertService = await HostedService.create({
                        user_email: req.body.user_email,
                        duration: req.body.duration,
                        service_type: req.body.service_type,
                        service_image: req.body.service_image,
                        git_repository: req.body.git_repository,
                        service_started: date,
                        pod_name: buildImage.podName,
                        service_ended: selesai,
                        db_dialect: req.body.db_dialect,
                    });
                    resSuccessHandler(res, insertService, "success");
                } else {
                    throw new ClientError("Proses Pembuatan Container Gagal");
                }
            } else if (req.body.service_type === "WB") {
                const createWebResource = async () => {
                    const podName = "wb" + "-" + randomizedName;
                    const svcName = "svc" + "-" + randomizedName;
                    try {
                        const makePod = async () => {
                            const webPod = JSON.stringify({
                                apiVersion: "v1",
                                kind: "Pod",
                                metadata: {
                                    name: podName,
                                    labels: {
                                        userapp: validateUser.username,
                                        "svc-type": "web",
                                    },
                                },
                                spec: {
                                    containers: [
                                        {
                                            name: "nginx",
                                            image: "nginx",
                                            ports: [
                                                {
                                                    containerPort: 80,
                                                },
                                            ],
                                            imagePullPolicy: "IfNotPresent",
                                        },
                                    ],
                                },
                            });

                            const podAxiosConfig = {
                                method: "post",
                                url:
                                    process.env.KUBE_LINK +
                                    "/namespaces/default/pods",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${process.env.KUBE_TOKEN}`,
                                },
                                data: webPod,
                            };
                            return await axios(podAxiosConfig);
                        };
                        await makePod();

                        const makeService = async () => {
                            const webSvc = JSON.stringify({
                                apiVersion: "v1",
                                kind: "Service",
                                metadata: {
                                    name: svcName,
                                    labels: {
                                        userapp: validateUser.username,
                                        "svc-type": "web",
                                    },
                                },
                                spec: {
                                    ports: [
                                        {
                                            port: 80,
                                            targetPort: 80,
                                        },
                                    ],
                                    selector: {
                                        userapp: validateUser.username,
                                    },
                                    type: "NodePort",
                                },
                            });

                            const svcAxiosConfig = {
                                method: "post",
                                url:
                                    process.env.KUBE_LINK +
                                    "/namespaces/default/services",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${process.env.KUBE_TOKEN}`,
                                },
                                data: webSvc,
                            };
                            return await axios(svcAxiosConfig);
                        };
                        await makeService();

                        return {
                            status: "success",
                            podName: podName,
                        };
                    } catch (err) {
                        return err;
                    }
                };

                const buildImage = await createWebResource();
                console.log(buildImage);
                if (buildImage.status == "success") {
                    selesai.setDate(date.getDate() + req.body.duration);
                    const insertService = await HostedService.create({
                        user_email: req.body.user_email,
                        duration: req.body.duration,
                        service_type: req.body.service_type,
                        service_image: req.body.service_image,
                        git_repository: req.body.git_repository,
                        pod_name: buildImage.podName,
                        service_started: date,
                        service_ended: selesai,
                        db_dialect: req.body.db_dialect,
                    });
                    resSuccessHandler(res, insertService, "success");
                } else {
                    throw new ClientError("Proses Pembuatan Container Gagal");
                }
            }
        }
    } catch (err) {
        resErrorHandler(res, err);
    }
};

const clientDashboard = async (req, res) => {
    try {
        const userEmail = req.params.email;
        if (!userEmail) {
            throw new ClientError("Insert User Email");
        }
        const getClientService = await HostedService.findAll({
            where: {
                user_email: userEmail,
            },
            order: [["service_type", "ASC"]],
        });

        if (getClientService.length === 0) {
            return resSuccessHandler(
                res,
                "succeess",
                "Maaf, Anda Belum Pernah Melakukan Hosting Menggunakan Layanan Kami."
            );
        } else {
            return resSuccessHandler(res, getClientService, "success");
        }
    } catch (err) {
        return resErrorHandler(res, err);
    }
};

const serviceDetail = async (req, res) => {
    try {
        const podDetail = req.params.pods;
        const getPodName = await HostedService.findOne({
            where: { pod_name: podDetail },
        });
        if (!getPodName) {
            throw new ClientError("Pod Tidak Terdaftar");
        } else {
            const createdPodConfig = {
                method: "get",
                url:
                    process.env.KUBE_LINK +
                    "/namespaces/default/pods/" +
                    podDetail,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.KUBE_TOKEN}`,
                },
            };
            const getCreatedPod = await axios(createdPodConfig);
            let detailedResult = {};
            detailedResult = getCreatedPod.data.status;
            console.log(detailedResult);
            const resultDetail = {
                pod_name: getPodName.pod_name,
                pod_ip: detailedResult.podIP,
                machine_status: detailedResult.containerStatuses[0].ready,
                start_date: getPodName.service_started,
                end_date: getPodName.service_ended,
                duration: getPodName.duration,
                git_repository: getPodName.git_repository,
                service_type: getPodName.service_type,
                service_image: getPodName.service_image,
                db_dialect: getPodName.db_dialect,
                user_email: getPodName.user_email,
            };
            return resSuccessHandler(res, resultDetail, "success");
        }
    } catch (err) {
        return resErrorHandler(res, err);
    }
};

function makeName(length) {
    var result = "";
    var characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
}

module.exports = { createService, clientDashboard, serviceDetail };
