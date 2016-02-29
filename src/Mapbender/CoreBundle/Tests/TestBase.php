<?php
namespace Mapbender\CoreBundle\Tests;

use Symfony\Bundle\FrameworkBundle\Client;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\DependencyInjection\Container;

/**
 * Class SymfonyTest
 *
 * @author  Andriy Oblivantsev <eslider@gmail.com>
 */
class TestBase extends WebTestCase
{
    /** @var Client */
    protected static $client;

    /** @var Container Container */
    protected static $container;

    /**
     * Setup before run tests
     */
    public static function setUpBeforeClass()
    {
        self::$client    = static::createClient();
        self::$container = self::$client->getContainer();
    }

    /**
     * @param string $serviceName
     * @return object
     */
    protected function get($serviceName)
    {
        return self::$container->get($serviceName);
    }

    /**
     * @return Client
     */
    public function getClient()
    {
        return self::$client;
    }

    /**
     * Get symfony parameter
     *
     * @param $name
     * @return mixed|null
     */
    public function getParameter($name)
    {
        return self::$container->hasParameter($name) ? self::$container->getParameter($name) : null;
    }
}